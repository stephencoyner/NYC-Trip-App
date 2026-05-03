// iOS doesn't expose a "save to Photos" API to the web. The Web Share API is
// the only path — it opens the native share sheet with the file attached, and
// the user taps "Save Image" themselves. Available in Safari 15+ and in PWAs.

export function canShareFiles(): boolean {
  if (typeof navigator === "undefined") return false;
  if (typeof navigator.share !== "function") return false;
  if (typeof navigator.canShare !== "function") return false;
  try {
    const dummy = new File(
      [new Blob([new Uint8Array([0])], { type: "image/jpeg" })],
      "probe.jpg",
      { type: "image/jpeg" }
    );
    return navigator.canShare({ files: [dummy] });
  } catch {
    return false;
  }
}

export async function shareFiles(
  files: File[],
  title?: string
): Promise<"shared" | "cancelled" | "unsupported"> {
  if (!canShareFiles()) return "unsupported";
  try {
    await navigator.share({ files, title: title || "New York, in May" });
    return "shared";
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return "cancelled";
    console.error("[shareFiles] failed:", err);
    return "cancelled";
  }
}

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export function captureFilename(dayId: string, stopId: string, kind: "photo" | "voice" = "photo"): string {
  const ext = kind === "photo" ? "jpg" : "m4a";
  return `nyc-${dayId}-${stopId}-${kind}.${ext}`;
}
