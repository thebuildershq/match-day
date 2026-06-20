import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Field } from "../../components/Field";
import { AuthLayout, Divider, PasswordToggle, SocialButtons, primaryBtn } from "./Authlayout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Pick a display name.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email.";
    if (password.length < 8) next.password = "At least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    // Clerk's signUp.create() goes here later. UI-only: enter the app to create a pool.
    navigate("/app/new");
  }

  return (
    <AuthLayout aside={<RegisterAside />}>
      <form onSubmit={submit} noValidate>
        <div className="mb-2 font-serif text-[15px] italic text-accent">Kick-off</div>
        <h1 className="mb-2.5 text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-none tracking-[-0.03em]">Start your season.</h1>
        <p className="mb-8 text-[15px] text-muted">Free, friends only, no money. Set up in under a minute.</p>

        <Field
          id="name"
          label="Display name"
          autoComplete="nickname"
          placeholder="What the table calls you"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          trailing={<PasswordToggle shown={show} onToggle={() => setShow((s) => !s)} />}
        />

        <button type="submit" className={primaryBtn("accent")}>
          Create my pool →
        </button>

        <p className="mt-4 text-center text-[12.5px] leading-relaxed text-faint">
          By continuing you agree to our{" "}
          <button type="button" className="font-semibold text-muted underline">
            Terms
          </button>{" "}
          &amp;{" "}
          <button type="button" className="font-semibold text-muted underline">
            Privacy Policy
          </button>
          .
        </p>

        <Divider label="or" />
        <SocialButtons onPick={() => navigate("/app/new")} />

        <p className="mt-7 text-center text-sm text-muted">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="border-b-2 border-accent font-bold text-ink">
            Log in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

function RegisterAside() {
  const steps: [string, string][] = [
    ["01", "Name your pool, pick a competition."],
    ["02", "Share one invite link."],
    ["03", "Predict every matchday. Settle it on the table."],
  ];
  return (
    <>
      <div className="max-w-[24rem] font-serif text-[clamp(1.6rem,3vw,2.3rem)] italic leading-[1.25]">
        "One link in the group chat. By Saturday, everyone's got an opinion on the line."
      </div>
      <div className="flex flex-col gap-4">
        {steps.map(([n, text]) => (
          <div key={n} className="flex items-start gap-3.5">
            <span className="text-base font-extrabold text-[#ff8c82]">{n}</span>
            <span className="text-[15px] leading-snug text-bg/80">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}