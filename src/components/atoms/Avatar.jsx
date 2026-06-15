// Avatar circular. Si recibe `uri` muestra la imagen; si no, la inicial.
export default function Avatar({ name, uri, size = 40 }) {
  if (uri) {
    return (
      <div
        className="rounded-full overflow-hidden bg-surface-container-high shrink-0"
        style={{ width: size, height: size }}
      >
        <img src={uri} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className="rounded-full bg-primary text-on-primary font-extrabold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initial}
    </div>
  );
}
