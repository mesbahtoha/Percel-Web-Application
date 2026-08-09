import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  CreditCard,
  MapPinned,
  Menu,
  LogOut,
  LayoutDashboard,
  User,
  PlusCircle,
  Bell,
  RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ProfastLogo from "../pages/shared/ProfastLogo/ProfastLogo";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNotificationAlerts } from "../hooks/useNotificationAlerts";
import {
  userNotificationsKey,
  userUnreadCountKey,
} from "../pages/Dashboard/Notifications/UserNotifications";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const defaultAvatar =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  const avatarSrc = user?.photoURL || defaultAvatar;

  /**
   * Shared sidebar nav link styles
   */
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive
        ? "bg-primary text-primary-content shadow-sm"
        : "text-base-content/80 hover:bg-base-300 hover:text-base-content"
    }`;

  /**
   * Live unread count — polls every 5s, fires a toast when new
   * notifications arrive and keeps the tab title in sync.
   */
  const unreadCount = useNotificationAlerts({
    role: "user",
    email: user?.email,
    viewPath: "/dashboard/notifications",
    unreadKey: userUnreadCountKey(user?.email),
  });

  /**
   * Recent notifications for the bell dropdown.
   * Shares the cache with the Notifications page, so marking items
   * as read there immediately reflects in the dropdown badge.
   */
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: userNotificationsKey(user?.email),
    queryFn: async () => {
      const res = await axiosSecure.get("/user/notifications");
      return res.data || [];
    },
    enabled: notificationOpen && !!user?.email,
    refetchInterval: notificationOpen ? 5000 : false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const recentNotifications = notifications.slice(0, 5);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosSecure.patch(`/user/notifications/${id}/read`);
      queryClient.setQueryData(userNotificationsKey(user?.email), (old = []) =>
        old.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      queryClient.setQueryData(userUnreadCountKey(user?.email), (old) => ({
        count: Math.max(0, (old?.count ?? 1) - 1),
      }));
    } catch {
      // ignore read-marking failures
    }
  };

  /**
   * Logout handler
   */
  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  return (
    <div className="drawer min-h-screen bg-base-100 lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-ghost btn-square lg:hidden"
                aria-label="open sidebar"
              >
                <Menu className="h-6 w-6" />
              </label>

              <div>
                <h1 className="text-lg font-bold text-base-content md:text-xl">
                  Dashboard
                </h1>
                <p className="hidden text-sm text-base-content/60 sm:block">
                  Manage your parcels, payments and tracking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:opacity-90 md:inline-block"
              >
                Back to Home
              </Link>

              {/* Notification bell dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  aria-label="Notifications"
                  className="btn btn-ghost btn-circle relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-[340px] rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-base-content">
                          Notifications
                        </h3>
                        <p className="text-xs text-base-content/60">
                          {unreadCount} unread
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => refetchNotifications()}
                        className="rounded-lg p-2 text-base-content/50 hover:bg-base-200"
                        aria-label="Refresh notifications"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>

                    <div className="max-h-96 space-y-2 overflow-y-auto">
                      {recentNotifications.length === 0 ? (
                        <div className="rounded-xl bg-base-200 p-4 text-center text-sm text-base-content/60">
                          No notifications found
                        </div>
                      ) : (
                        recentNotifications.map((item) => (
                          <button
                            type="button"
                            key={item._id}
                            onClick={() => handleMarkAsRead(item._id)}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              item.isRead
                                ? "border-base-300 bg-base-100"
                                : "border-primary/30 bg-primary/5"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-base-content">
                                  {item.title || "Notification"}
                                </p>
                                <p className="mt-1 text-xs text-base-content/70">
                                  {item.message || "No message"}
                                </p>
                                <p className="mt-2 text-[11px] text-base-content/40">
                                  {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString()
                                    : ""}
                                </p>
                              </div>

                              {!item.isRead && (
                                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    <div className="mt-3 border-t border-base-300 pt-3">
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setNotificationOpen(false)}
                        className="block w-full rounded-xl bg-base-200 px-4 py-2 text-center text-sm font-medium text-base-content hover:bg-base-300"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-9 rounded-full ring ring-primary/30 ring-offset-2 ring-offset-base-100 md:w-10">
                    <img
                      alt="User avatar"
                      src={avatarSrc}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-[100] mt-3 w-56 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg"
                >
                  <li className="pointer-events-none mb-1 px-2 py-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-base-content">
                        {user?.displayName || "User"}
                      </span>
                      <span className="break-all text-xs text-base-content/60">
                        {user?.email || "No email"}
                      </span>
                    </div>
                  </li>

                  <li>
                    <Link to="/profile">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </li>

                  <li>
                    <button type="button" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Routed page content */}
        <main className="flex-1 bg-base-200 p-4 text-base-content md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <aside className="flex min-h-full w-80 flex-col border-r border-base-300 bg-base-100">
          {/* Sidebar top logo */}
          <div className="border-b border-base-300 px-5 py-5">
            <ProfastLogo />
          </div>

          {/* User summary */}
          <div className="border-b border-base-300 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary/30 ring-offset-2 ring-offset-base-100">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-base-content">
                  {user?.displayName || "User"}
                </h3>
                <p className="truncate text-sm text-base-content/60">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-base-content/40">
              Main Menu
            </div>

            <nav className="space-y-1">
              <NavLink to="/" end className={navLinkClass}>
                <Home className="h-5 w-5" />
                <span>Home</span>
              </NavLink>

              <NavLink to="/dashboard/overview" className={navLinkClass}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Overview</span>
              </NavLink>

              <NavLink to="/dashboard/addParcel" className={navLinkClass}>
                <PlusCircle className="h-5 w-5" />
                <span>Add Parcel</span>
              </NavLink>

              <NavLink to="/dashboard/myParcels" className={navLinkClass}>
                <Package className="h-5 w-5" />
                <span>My Parcels</span>
              </NavLink>

              <NavLink to="/dashboard/paymentHistory" className={navLinkClass}>
                <CreditCard className="h-5 w-5" />
                <span>Payment History</span>
              </NavLink>

              <NavLink to="/dashboard/trackParcel" className={navLinkClass}>
                <MapPinned className="h-5 w-5" />
                <span>Track Parcel</span>
              </NavLink>

              <NavLink to="/dashboard/notifications" className={navLinkClass}>
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                  )}
                </div>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-content">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Sidebar logout button */}
          <div className="border-t border-base-300 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error transition hover:bg-error/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
