import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Field } from "../../components/Field";
import { AuthLayout, Divider, PasswordToggle, SocialButtons, primaryBtn } from "./Authlayout";
// import { AuthLayout } from "./Authlayout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    // Clerk's signIn.create() goes here later. UI-only: enter the app.
    navigate("/app/predict");
  }

  return (
    <AuthLayout aside={<LoginAside />}>
      <form onSubmit={submit} noValidate>
        <div className="mb-2 font-serif text-[15px] italic text-accent">Back for more</div>
        <h1 className="mb-2.5 text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-none tracking-[-0.03em]">Welcome back.</h1>
        <p className="mb-8 text-[15px] text-muted">The table's been moving without you.</p>

        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          id="password"
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          labelAside={
            <button type="button" className="text-[12.5px] font-semibold text-accent">
              Forgot?
            </button>
          }
          trailing={<PasswordToggle shown={show} onToggle={() => setShow((s) => !s)} />}
        />

        <button type="submit" className={primaryBtn("ink")}>
          Log in
        </button>

        <Divider label="or" />
        <SocialButtons onPick={() => navigate("/app/predict")} />

        <p className="mt-7 text-center text-sm text-muted">
          New here?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="border-b-2 border-accent font-bold text-ink"
          >
            Create a pool
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

function LoginAside() {
  const rows: [string, string, number][] = [
    ["1", "Dela", 41],
    ["2", "Ama", 38],
    ["4", "You", 32],
  ];
  return (
    <>
      <div className="max-w-[24rem] font-serif text-[clamp(1.6rem,3vw,2.3rem)] italic leading-[1.25]">
        "He's bottom of the table and still won't stop talking. Log in. Fix it."
      </div>
      <div className="rounded-2xl border border-bg/10 bg-bg/[0.06] px-5 py-[18px]">
        <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-bg/40">The Group Chat XI · live</div>
        <div className="flex flex-col gap-3.5">
          {rows.map(([rank, name, pts], i) => (
            <div key={name} className={i === 2 ? "flex items-center justify-between opacity-55" : "flex items-center justify-between"}>
              <div className="flex items-center gap-[11px]">
                <span className={i === 0 ? "text-[13px] font-extrabold text-[#ff8c82]" : "text-[13px] font-extrabold text-bg/40"}>{rank}</span>
                <span className="text-[14.5px] font-semibold">{name}</span>
              </div>
              <span className="text-[15px] font-extrabold tabular-nums">{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}