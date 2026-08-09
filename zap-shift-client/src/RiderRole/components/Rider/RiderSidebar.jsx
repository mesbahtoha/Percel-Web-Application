import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiDollarSign,
  FiGrid,
  FiHome,
  FiLogOut,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import { useNotificationAlerts } from "../../../hooks/useNotificationAlerts";
import ProfastLogo from "../../../pages/shared/ProfastLogo/ProfastLogo";
import { riderUnreadCountKey } from "../../pages/Rider/RiderNotification";

// ─────────────────────────────────────────────
// Unread badge
// ─────────────────────────────────────────────
const UnreadBadge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
};

const RiderSidebar = ({ onNavigate, mobile = false }) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch unread count — auto-polls every 5s so badge stays live
  const unreadCount = useNotificationAlerts({
    role: "rider",
    email: user?.email,
    viewPath: "/dashboard/rider/riderNotification",
    unreadKey: riderUnreadCountKey(user?.email),
  });

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-lime-100 text-lime-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const NAV_ITEMS = [
    { to: "/",                            icon: <FiHome size={18} />,     label: "Home"          },
    { to: "/dashboard/rider/overview",    icon: <FiGrid size={18} />,     label: "Overview"      },
    { to: "/dashboard/rider/tasks",       icon: <FiTruck size={18} />,    label: "My Tasks"      },
    { to: "/dashboard/rider/earnings",    icon: <FiDollarSign size={18} />, label: "Earnings"    },
    { to: "/dashboard/rider/profile",     icon: <FiUser size={18} />,     label: "Profile"       },
  ];

  return (
    <aside
      className={`flex h-full w-72 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-5 ${
        mobile ? "block" : ""
      }`}
    >
      {/* Logo + close btn */}
      <div className="mb-8 flex items-center justify-between">
        <ProfastLogo />
        {mobile && (
          <button
            type="button"
            onClick={onNavigate}
            className="btn btn-ghost btn-sm lg:hidden"
          >
            <FiX size={22} />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Rider Panel
        </h3>
      </div>

      {/* Nav links */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={linkClass}
            onClick={onNavigate}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {/* Notifications — special: shows unread badge */}
        <NavLink
          to="/dashboard/rider/riderNotification"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-lime-100 text-lime-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
          onClick={onNavigate}
        >
          <div className="relative">
            <FiBell size={18} />
            {/* Dot indicator on icon */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
            )}
          </div>
          Notifications
          <UnreadBadge count={unreadCount} />
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default RiderSidebar;