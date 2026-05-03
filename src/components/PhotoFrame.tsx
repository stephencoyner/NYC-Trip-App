import React, { useEffect, useState } from "react";
import { getBlob } from "../lib/storage";

type Props = {
  blobKey?: string;
  src?: string;
  alt?: string;
  className?: string;
  ratio?: "square" | "wide" | "auto";
  deckle?: boolean; // recap-only torn edge
};

export function PhotoFrame({ blobKey, src, alt, className = "", ratio = "auto", deckle }: Props) {
  const [url, setUrl] = useState<string | undefined>(src);
  useEffect(() => {
    let revoked: string | undefined;
    if (blobKey) {
      getBlob(blobKey).then((b) => {
        if (b) {
          const u = URL.createObjectURL(b);
          revoked = u;
          setUrl(u);
        }
      });
    } else if (src) {
      setUrl(src);
    }
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [blobKey, src]);

  const aspect = ratio === "square" ? "aspect-square" : ratio === "wide" ? "aspect-[3/2]" : "";
  const mask = deckle
    ? { WebkitMaskImage: "url(/deckle.svg)", maskImage: "url(/deckle.svg)", WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }
    : undefined;

  return (
    <figure
      className={["bg-paper-2 p-2 ring-1 ring-rule/70 inline-block", aspect, className].join(" ")}
      style={mask}
    >
      {url ? (
        <img src={url} alt={alt || ""} className={["block w-full", aspect ? "h-full" : "h-auto", "object-cover"].join(" ")} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-ink-2 font-serif italic">
          —
        </div>
      )}
    </figure>
  );
}
