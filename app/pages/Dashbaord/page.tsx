"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Package, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

// Sample data for charts
const packageTrends = [
  { month: "Jan", incoming: 45, outgoing: 32, pending: 12 },
  { month: "Feb", incoming: 52, outgoing: 38, pending: 18 },
  { month: "Mar", incoming: 48, outgoing: 35, pending: 15 },
  { month: "Apr", incoming: 61, outgoing: 45, pending: 22 },
  { month: "May", incoming: 55, outgoing: 40, pending: 20 },
  { month: "Jun", incoming: 67, outgoing: 52, pending: 25 },
];

const packageStatus = [
  { name: "Completed", value: 285, color: "#34d399" },
  { name: "Pending", value: 127, color: "#f97316" },
  { name: "In Transit", value: 95, color: "#0084c8" },
];

const packageDistribution = [
  { name: "Vision Care", packages: 89 },
  { name: "Medical Supplies", packages: 65 },
  { name: "Electronics", packages: 78 },
  { name: "Documents", packages: 54 },
  { name: "Other", packages: 42 },
];

const recentActivities = [
  { id: "000001", type: "Incoming", customer: "Vision care panadura", status: "Completed", time: "2 hours ago" },
  { id: "000002", type: "Outgoing", customer: "Medical Supplies Ltd", status: "In Transit", time: "4 hours ago" },
  { id: "000003", type: "Incoming", customer: "Electronics Hub", status: "Completed", time: "6 hours ago" },
  { id: "000004", type: "Outgoing", customer: "Document Services", status: "Pending", time: "8 hours ago" },
  { id: "000005", type: "Incoming", customer: "Vision care panadura", status: "Completed", time: "1 day ago" },
];

// KPI Card Component
interface KPICardProps {
  icon: React.ComponentType<{ size: number; className: string }>;
  label: string;
  value: string | number;
  change: number;
  color: string;
}

const KPICard = ({ icon: Icon, label, value, change, color }: KPICardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-[#0c244c] mt-2">{value}</p>
        <p className={`text-sm mt-2 font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all overflow-auto">
        {/* --- HEADER SECTION --- */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#0c244c]">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here&apos;s your package management overview.</p>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPICard 
            icon={Package}
            label="Total Packages"
            value="507"
            change={12}
            color="bg-blue-500"
          />
          <KPICard 
            icon={CheckCircle}
            label="Completed"
            value="285"
            change={8}
            color="bg-green-500"
          />
          <KPICard 
            icon={AlertCircle}
            label="Pending"
            value="127"
            change={-3}
            color="bg-orange-500"
          />
          <KPICard 
            icon={TrendingUp}
            label="In Transit"
            value="95"
            change={15}
            color="bg-purple-500"
          />
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Line Chart - Package Trends */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0c244c] mb-6">Package Trends (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={packageTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="incoming" stroke="#0084c8" strokeWidth={3} dot={{ fill: "#0084c8", r: 5 }} />
                <Line type="monotone" dataKey="outgoing" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
                <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Package Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold text-[#0c244c] mb-6">Package Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {packageStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- BAR CHART & RECENT ACTIVITY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart - Package Distribution by Customer */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0c244c] mb-6">Packages by Customer</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={packageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="packages" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0c244c] mb-6">Recent Activity</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-[#0084c8] pl-4 py-2 hover:bg-gray-50 rounded-r transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#0c244c]">#{activity.id}</p>
                      <p className="text-xs text-gray-600">{activity.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      activity.status === "Completed" ? "bg-green-100 text-green-700" :
                      activity.status === "Pending" ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- STATS FOOTER --- */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-[#0084c8] to-[#0071ad] rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">Success Rate</h3>
            <p className="text-4xl font-bold">94.2%</p>
            <p className="text-sm opacity-90 mt-2">Of packages delivered on time</p>
          </div>

          <div className="bg-linear-to-br from-[#6366f1] to-[#4f46e5] rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">Avg. Processing Time</h3>
            <p className="text-4xl font-bold">2.4h</p>
            <p className="text-sm opacity-90 mt-2">Average per package</p>
          </div>

          <div className="bg-linear-to-br from-[#34d399] to-[#10b981] rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold mb-2">Customer Satisfaction</h3>
            <p className="text-4xl font-bold">4.8/5</p>
            <p className="text-sm opacity-90 mt-2">Based on 500+ reviews</p>
          </div>
        </div>
      </main>
    </div>
  );
}
