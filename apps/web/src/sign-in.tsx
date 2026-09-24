import { useState, type FormEvent } from "react";

export function SignIn({
  error,
  busy,
  onSignIn,
}: {
  error: string;
  busy: boolean;
  onSignIn: (key: string) => Promise<boolean>;
}) {
  const [key, setKey] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (await onSignIn(key)) setKey("");
  }

  return (
    <main className="sheet-ruled grid min-h-dvh place-items-center px-6 py-16">
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-[400px] border border-rule bg-sheet px-8 pt-8 pb-9"
      >
        <h1 className="text-[28px] leading-none font-semibold tracking-tight">
          Aura
        </h1>
        <p className="mt-3 text-ink-2">
          Paper trading research. It runs on this computer and never touches
          real money.
        </p>
        <label
          htmlFor="owner-key"
          className="mt-9 block text-[13px] font-medium"
        >
          Owner key
        </label>
        <input
          id="owner-key"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          required
          className="mt-2 h-10 w-full border border-ink bg-sheet px-3 font-mono"
        />
        <p className="mt-2 text-[12px] text-ink-3">
          <code>AURA_OWNER_KEY</code> in the <code>.env</code> file that the
          bootstrap script created.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 border-l-2 border-stop pl-3 text-stop"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn btn-solid mt-7 h-10 w-full"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
