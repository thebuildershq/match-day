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

