import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

/**
 * Real-time notification alerts for dashboards.
 *
 * Polls the unread notification count every 5 seconds, fires a toast
 * whenever new notifications arrive, and keeps the browser tab title
 * in sync with the unread count.
 *
 * @param {string}  role        "user" | "rider"
 * @param {string}  email       logged in user email
 * @param {string}  viewPath    route to open when the toast is clicked
 * @param {array}   unreadKey   react-query key used for the unread count
 * @returns {number}            live unread count
 */
export const useNotificationAlerts = ({
  role,
  email,
  viewPath,
  unreadKey,
}) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const prevCountRef = useRef(null);

  const { data: unreadData } = useQuery({
    queryKey: unreadKey,
    queryFn: async () => {
      const res = await axiosSecure.get(`/${role}/notifications/unread-count`);
      return res.data || { count: 0 };
    },
    enabled: !!email,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const count = unreadData?.count ?? 0;

  // ── Toast on new notifications ──────────────────────
  useEffect(() => {
    // First render: just remember the baseline, don't toast
    if (prevCountRef.current === null) {
      prevCountRef.current = count;
      return;
    }

    const delta = count - prevCountRef.current;
    prevCountRef.current = count;

    if (delta <= 0) return;

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${delta} new notification${delta > 1 ? "s" : ""}`,
      text: "Click to view",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#083c46",
      color: "#ffffff",
      didOpen: (el) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          Swal.close();
          navigate(viewPath);
        });
      },
    });
  }, [count, navigate, viewPath]);

  // ── Tab title badge ─────────────────────────────────
  useEffect(() => {
    const base = "Profast — Parcel Delivery";
    document.title = count > 0 ? `(${count}) ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [count]);

  return count;
};
