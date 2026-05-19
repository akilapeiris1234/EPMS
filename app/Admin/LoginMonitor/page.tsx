"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import AlertModal from "@/components/AlertModal";
import { PermissionGuard } from "@/hooks/usePermissions";
import {
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  Shield,
  Globe,
  Clock,
  Search,
  User,
} from "lucide-react";

interface LoginSession {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  role: string;
  ipAddress: string;
  userAgent: string | null;
  loginAt: string | null;
  logoutAt: string | null;
  isActive: boolean;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseUserAgent(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return ua.substring(0, 40) + (ua.length > 40 ? "…" : "");
}

function parseOS(ua: string | null): string {
  if (!ua) return "";
  if (ua.includes("Windows NT 10")) return "Windows 10/11";
  if (ua.includes("Windows NT 6.1")) return "Windows 7";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "";
}

export default function LoginMonitorPage() {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "ended">("all");
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, title: "", message: "", type: "info" });

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login-monitor");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load sessions");
      setSessions(json.data ?? []);
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: "Error",
        message: err instanceof Error ? err.message : "Failed to load sessions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);



  const filtered = sessions.filter((s) => {
    const matchesSearch =
      !search ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && s.isActive) ||
      (filterActive === "ended" && !s.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeCount = sessions.filter((s) => s.isActive).length;
  const totalCount = sessions.length;

  return (
    <PermissionGuard permission="loginMonitor">
      <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
        <Sidebar />
        <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">

        {/* Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c] flex items-center gap-3">
              <Monitor className="text-[#3ea5d9]" size={36} />
              Login Monitor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track active sessions, IP addresses, and manage user access in real time.
            </p>
          </div>
          <button
            onClick={() => void fetchSessions()}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0c244c] px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Wifi className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Sessions</p>
              <p className="text-3xl font-black text-green-600">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
              <WifiOff className="text-gray-400" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ended Sessions</p>
              <p className="text-3xl font-black text-gray-600">{totalCount - activeCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Shield className="text-[#3ea5d9]" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Logins</p>
              <p className="text-3xl font-black text-[#0c244c]">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <input
              type="text"
              placeholder="Search by username, name, IP, or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "ended"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  filterActive === f
                    ? "bg-[#0c244c] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0c244c]">Login Sessions</h2>
            <span className="text-sm text-gray-500">
              {loading ? "Loading…" : `${filtered.length} of ${totalCount} records`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0084c8]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-medium">
              No sessions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">
                      <div className="flex items-center gap-1"><Globe size={12} /> IP Address</div>
                    </th>
                    <th className="px-5 py-3">Browser / OS</th>
                    <th className="px-5 py-3">
                      <div className="flex items-center gap-1"><Clock size={12} /> Login Time</div>
                    </th>
                    <th className="px-5 py-3">Logout Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((session) => (
                    <tr
                      key={session.id}
                      className={`transition-colors ${session.isActive ? "hover:bg-green-50/30" : "hover:bg-gray-50 opacity-70"}`}
                    >
                      <td className="px-5 py-4">
                        {session.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                            Ended
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#3ea5d9] shrink-0">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#0c244c]">{session.fullName}</p>
                            <p className="text-xs text-gray-400">@{session.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          session.role === "admin" || session.role === "superAdmin"
                            ? "bg-purple-100 text-purple-700"
                            : session.role === "guard"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {session.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {session.ipAddress}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div>{parseUserAgent(session.userAgent)}</div>
                        <div className="text-xs text-gray-400">{parseOS(session.userAgent)}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateTime(session.loginAt)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {session.logoutAt ? formatDateTime(session.logoutAt) : <span className="text-green-500 font-semibold">Still active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal((m) => ({ ...m, isOpen: false }))}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </main>
    </div>
    </PermissionGuard>
  );
}
