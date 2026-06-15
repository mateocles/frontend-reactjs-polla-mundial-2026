import { useState } from "react";
import { teamFlagUrl } from "../../utils/flags";

// Insignia de selección: bandera real (flagcdn) o iniciales si falla.
export default function TeamBadge({ name, size = 48 }) {
  const [failed, setFailed] = useState(false);
  const url = teamFlagUrl(name, size <= 32 ? 80 : 160);
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className="rounded-full overflow-hidden bg-surface-container-high border border-white/10 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {url && !failed ? (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-on-surface-variant font-bold" style={{ fontSize: size * 0.3 }}>
          {initials}
        </span>
      )}
    </div>
  );
}
