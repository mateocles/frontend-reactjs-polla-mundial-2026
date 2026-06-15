import { NavLink } from "react-router-dom";
import { Trophy, Users, User } from "lucide-react";

const ITEMS = [
  { to: "/matches", label: "Matches", icon: Trophy },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 h-20 flex justify-around items-center border-t border-white/5 bg-surface/80 backdrop-blur-xl">
      {ITEMS.map(({ to, label, icon: Icon }) => (
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
          <span className="text-[11px] font-semibold">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
