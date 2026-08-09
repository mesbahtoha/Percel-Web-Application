import { FiBell, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useNotificationAlerts } from "../../../hooks/useNotificationAlerts";
import { riderUnreadCountKey } from "../../pages/Rider/RiderNotification";

const RiderTopbar = ({ onMenuClick }) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // ✅ Live unread count — polls every 5s, fires a toast when new
  //    notifications arrive and keeps the tab title in sync.
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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-center justify-between gap-4">

        {/* Left — hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="btn btn-ghost btn-sm lg:hidden"
          >
            <FiMenu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-[#083c46] sm:text-2xl">
              Rider Dashboard
            </h1>
            <p className="mt-0.5 hidden text-sm text-gray-500 sm:block">
              Manage deliveries, track progress, and view your earnings.
            </p>
          </div>
        </div>

        {/* Right — bell + profile */}
        <div className="flex items-center gap-3">

          {/* Notification bell */}
          <Link
            to="/dashboard/rider/riderNotification"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-[#083c46]"
            aria-label="Notifications"
          >
            <FiBell size={20} />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* Ping animation when there are unread */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer items-center gap-2"
            >
              <img
                src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar-placeholder.png"}
                alt="Rider"
                className="h-10 w-10 rounded-full border object-cover sm:h-11 sm:w-11"
                referrerPolicy="no-referrer"
              />
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[100] mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
            >
              <li className="pointer-events-none mb-1 px-2 py-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {user?.displayName || "Rider"}
                  </span>
                  <span className="break-all text-xs text-gray-500">
                    {user?.email || "No email"}
                  </span>
                </div>
              </li>

              <li>
                <Link to="/dashboard/rider/profile">
                  <FiUser size={16} /> Profile
                </Link>
              </li>

              <li>
                <button type="button" onClick={handleLogout}>
                  <FiLogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderTopbar;
