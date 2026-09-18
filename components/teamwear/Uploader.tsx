"use client";

import { useRef, useState } from "react";
import type { UploadedAsset } from "@/types";

const ACCEPTED = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

interface UploaderProps {
  label: string;
  hint: string;
  asset: UploadedAsset | null;
  onChange: (asset: UploadedAsset | null) => void;
}

type Status = "idle" | "reading" | "error";

/**
 * Artwork upload with the states that actually happen (brief 51): reading,
 * rejected type, oversize, and removal. The object URL is revoked on replace
 * and on removal so previews don't leak.
 *
 * The file is held in the browser. Nothing is transmitted until the request is
 * submitted.
 */
export function Uploader({ label, hint, asset, onChange }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setStatus("error");
      setError("That file type is not supported. Use PNG, JPG, SVG or WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus("error");
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.`);
      return;
    }

    setStatus("reading");
    try {
      if (asset) URL.revokeObjectURL(asset.previewUrl);
      const previewUrl = URL.createObjectURL(file);
      onChange({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
      });
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("That file could not be read. Try a different export.");
    }
  }

  function remove() {
    if (asset) URL.revokeObjectURL(asset.previewUrl);
    onChange(null);
    setStatus("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={`upload-${errorId}`} className="text-spec block text-muted">
        {label}
      </label>

      {asset ? (
        <div className="mt-3 flex items-center gap-4 border border-line bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.previewUrl}
            alt={`Preview of ${asset.name}`}
            className="h-14 w-14 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.875rem]">{asset.name}</p>
            <p className="text-spec mt-1 text-muted">{(asset.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={remove}
            className="min-h-[44px] px-3 text-[0.75rem] uppercase tracking-[0.1em] underline underline-offset-4 hover:text-accent-text"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <input
            ref={inputRef}
            id={`upload-${errorId}`}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={status === "error"}
            className="block w-full text-[0.875rem] text-muted file:mr-4 file:min-h-[44px] file:cursor-pointer file:border file:border-line-strong file:bg-canvas file:px-5 file:text-[0.75rem] file:uppercase file:tracking-[0.1em] file:text-ink hover:file:border-ink"
          />
          <p className="mt-2 text-[0.8125rem] text-muted">{hint}</p>
        </div>
      )}

      {status === "reading" && (
        <p className="text-spec mt-2 text-muted" role="status">
          Reading file…
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
