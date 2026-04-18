import { NavLink } from "react-router-dom";
import { Home, Compass, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", Icon: Home, end: true },
  { to: "/explore", label: "Explore", Icon: Compass, end: false },
  { to: "/alerts", label: "Alerts", Icon: Bell, end: false },
  { to: "/profile", label: "Profile", Icon: User, end: false },
];

export const BottomTabBar = () => {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-nav backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn("h-5 w-5", isActive ? "fill-foreground/10" : "")}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
