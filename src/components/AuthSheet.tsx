import React, { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { useAuth } from "../hooks/useAuth";

type Props = { open: boolean; onClose: () => void };

export function AuthSheet({ open, onClose }: Props) {
  const { user, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    const res = await signInWithEmail(trimmed);
    if (res.error) setError(res.error.message);
    else setSent(true);
    setLoading(false);
  }

  if (user) {
    return (
      <BottomSheet
        open={open}
        onClose={onClose}
        title={<>Backed up</>}
        footer={
          <button
            onClick={async () => {
              await signOut();
              onClose();
            }}
            className="block w-full py-3.5 text-center font-serif text-[18px] tracking-tight bg-paper-2 text-ink-2 active:bg-paper-2/80"
          >
            Sign out
          </button>
        }
      >
        <p className="font-serif italic text-[18px] leading-snug text-ink">
          Signed in as <span className="not-italic">{user.email}</span>.
        </p>
        <p className="mt-3 font-serif text-[15px] text-ink-2 leading-snug">
          Every photo, note, rating, and voice memo gets quietly mirrored to the cloud as you save it.
          If you reinstall the app or open it on another device and sign in, your trip comes back.
        </p>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={sent ? <>Check your email.</> : <>Back up your trip</>}
      footer={
        !sent && (
          <button
            onClick={submit}
            disabled={!email.trim() || loading}
            className={[
              "block w-full py-3.5 text-center font-serif text-[18px] tracking-tight transition-colors duration-150 ease-ios",
              email.trim() && !loading
                ? "bg-ink text-paper active:bg-ink/90"
                : "bg-paper-2 text-ink-2/60 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? ". . ." : "Send the link"}
          </button>
        )
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="font-serif italic text-[18px] leading-snug">
            Open the email from Supabase on this device and tap the link. You'll come back here, signed in.
          </p>
          <p className="font-serif text-[14px] text-ink-2 leading-snug">
            Future captures sync silently. Anything you've already saved locally will mirror up the moment you're signed in.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="font-serif italic text-[16.5px] leading-snug text-ink-2 max-w-[34ch]">
            One sign-in protects every photo and note from a Safari cache wipe.
            No password — we'll email you a link.
          </p>
          <label className="block">
            <span className="smallcaps text-ink-2 mb-1 block">Your email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-serif italic text-[18px]"
              autoComplete="email"
              autoCapitalize="none"
              inputMode="email"
              autoFocus
            />
          </label>
          {error && <p className="font-mono text-[12px] text-accent">{error}</p>}
        </div>
      )}
    </BottomSheet>
  );
}
