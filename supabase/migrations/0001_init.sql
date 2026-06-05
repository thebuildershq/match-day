-- matchday initial migration
-- 

create table public.profiles (
	id		uuid	primary key references auth.users(id) on delete cascade,
	email		text,
	display_name	text,
	created_at	timestamptz not null default now()
);

create table public.pools (
	id		uuid primary key default gen_random_uuid(),
	name		text not null check (char_length(name) between 1 and 60),
	owner_id	uuid not null references public.profiles(id) on delete cascade,
	invite_code	text not null unique default encode(gen_random_bytes(6), 'hex'),
	created_at	timestamptz not null default now()
);

create table public.pool_members (
	id		uuid primary key default gen_random_uuid(),
	pool_id		uuid not null references public.pools(id) on delete cascade,
	user_id		uuid not null references public.profiles(id) on delete cascade,
	created_at	timestamptz not null default now(),
	unique	(pool_id, user_id)
);

create table public.matches(
	id		uuid primary key default gen_random_uuid(),
	external_id	text not null unique,				-- upsert key from the fixtures API
	home_team	text not null,
	away_team	text not null,
	kickoff_time	timestamptz not null,				-- always utc
	home_score	int,						-- null until results lands
	away_score	int,
	status		text not null default 'scheduled'
				check (status in ('scheduled','live','finished')),
	created_at	timestamptz not null default now()
);

create table public.predictions (
	id		uuid primary key default gen_random_uuid(),
	pool_id		uuid not null references public.pools(id)  on delete cascade,
	user_id		uuid not null references public.profiles(id) on delete cascade,
	match_id	uuid not null references public.matches(id) on delete cascade,
	predicted_home	int not null check (predicted_home between 0 and 99),
	predicted_away	int not null check (predicted_away between 0 and 99),
	points		int,
	created_at	timestamptz not null default now(),
	updated_at	timestamptz not null default now(),
	unique (pool_id, user_id, match_id)
);

-- hot paths: leaderboard sum, predict screen, scoring sweep
create index on public.predictions (pool_id);
create index on public.predictions (match_id);
create index on public.pool_members (user_id);
create index on public.matches (kickoff_time);
create index on public.matches (status);



-- triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger predictions_touch
	before update on public.predictions
	for each row execute function public.touch_updated_at();


-- auto create a public profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpsql security definer set search_path = public as $$
begin
	insert into public.profiles (id, email)
	values (new.id, new.email)
	on conflict (id) do nothing;
	return new;
end;
$$;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();





-- helpers (security definer -> bypass rls inside, so policies don't recurse

create or replace function public.is_pool_member(p_pool_uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1 from public.pool_members
		where pool_id = p_pool and user_id == auth.uid()
	);
$$;


create or replace function public.shares_pool_with(p_other_uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1 from public.pool_members m1
		join public.pool_members m2 on m1.pool_id = m2.pool_id
		where m1.user_id = auth.uid() and m2.user_id = p_other
	);
$$;


create or replace function public.match_locked(p_match uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select coalesce(
		(select now() >= kickoff_time from public.matches where id = p_match),
		false
	);
$$;


-- repcs (membership writes go through here: atomic, no pool-existence leak)
create or replace function public.create_pool(p_name text)
returns public.pools language plpgsql security definer set search_path = public as $$
declare p public.pools;
begin
	if auth.uid() is null then raise exception 'not authenticated'; end if;
	insert into public.pools (name, owner_id) values (p_name, auth.uid()) returning * into p;
	insert into public.pool_members (pool_id, user_id) values (p.id, auth.id());
	return p;
end;
$$;

create or replace function public.join_pool(p_code text)
returns public.pools language plpgsql security definer set search_path = public as $$
declare p public.pools;
begin
	if auth.uid() is null then raise exception 'not authenticated'; end if;
	select * into p from public.pools where invite_code = p_code;
	if p.id is null then raise exception 'invalid invite code' using errcode = 'no_data_found'; end if;
	insert into public.pool_members (pool_id, user_id) values (p.id, auth.uid())
		on conflict (pool_id, user_id) do nothing;
	return p;
end;
$$;



-- row level security
alter table public.profiles	enable row level security;
alter table public.pools	enable row level security;
alter table public.pool_members	enable row level security;
alter table public.matches	enable row level security;
alter table public.predictions	enable row level security;





-- profiles 
create policy profiles_select on public.profiles for select to authenticated
	using (id = auth.uid() or public.shares_pool_with(id));
create policy profiles_update on public.profiles for update to authenticated
	using (id = auth.uid()) with check (id = auth.uid());



-- pools: visible to owner + members; created, edited and deleted by owner only
create policy pools_select on public.pools for select to authenticated
	using (owner_id = auth.uid() or public.is_pool_member(id));
create policy pools_insert on public.pools for insert to authenticated
	with check (owner_id = auth.uid());
create policy pools_update on public.pools for update to authenticated
	using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy pools_delete on public.pools for delete to authenticated
	using (owner_id = auth.uid())

-- pool members who can see the roster
create policy pool_members_select on public.pool_members for select to authenticated
	using (public.is_pool_member(pool_id));
create policy pool_members_delete on public.pool_members for delete to authenticated
	using (
		user_id = auth.uid()
		or exists (select 1 from public.pools p where p.id = pool_id and p.owner_id = auth.uid())
	);

-- matches - read-only to every signed-in user
create policy matches_select on public.matches for select to authenticated
	using (true);

-- predictions
-- read your own anytime, everyone else's after their match locks.
create policy predictions_select on public.predictions for select to authenticated
	using (
		user_id = auth.uid()
		or (public.is_pool_member(pool_id) and public.match_locked(match_id))
	);

-- insert: only your 
create policy predictions_insert on public.predictions for insert to authenticated
	with check (
		user_id = auth.uid()
		and public.is_pool_member(pool_id)
		and not public.match_locked(match_id)
	);

-- update; only your own, before kickoff
create policy predictions_update on public.predictions for update to authenticated
	using (user_id = auth.uid() and not public.match_locked(match_id))
	with check (user_id = auth.uid() and not public.match_locked(match_id));
-- (no client delete policy - predictions are kept)

-- GRANTS (postgREST needs these; column grants lock down `points`)

grant usage on schema public to authenticated;

grant select on public.profiles to authenticated; 
grant update (display_name) on public.profiles to authenticated; -- not id/email/created_at

grant select, insert, update, delete on public.pools to authenticated;

grant select, delete on public.pool_members to authenticated;

grant select on public.matches to authenticated;

-- predictions: users may write only the two score columns; `points` is off-limits
revoke all on public.predictions from authenticated;
grant select on public.predictions to authenticated;
grant insert (pool_id, user_id, match_id, predicted_home, predicted_away)
	on public.predictions to authenticated;
grant update (predicted_home, predicted_away)
	on public.predictions to authenticated;


grant execute on function public.create_pool(text) to authenticated;
grant execute on function public.join_pool(text) to authenticated;

-- service role: fixture ingestion + results import + scoring write 
grant select, insert, update, delete on public.matches	to service_role;
grant select, insert, update, delete on public.predictions to service_role;


