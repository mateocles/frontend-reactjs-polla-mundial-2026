import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy, Users, User } from "lucide-react";

const ITEMS = [
  { to: "/matches", key: "nav.matches", icon: Trophy },
  { to: "/groups", key: "nav.groups", icon: Users },
  { to: "/profile", key: "nav.profile", icon: User },
];

export default function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="shrink-0 h-20 flex justify-around items-center border-t border-white/5 bg-surface/80 backdrop-blur-xl">
      {ITEMS.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-primary/80"
            }`
          }
        >
          <Icon size={22} strokeWidth={2} />
          <span className="text-[11px] font-semibold">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
