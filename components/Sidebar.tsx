"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import {
  LayoutGrid,
  Package,
  PackageSearch,
  ClipboardList,
  PackageCheck,
  PackageOpen,
  LogOut,
  Menu,
  X,
  Shield,
  LogIn,
  AlertCircle
} from 'lucide-react';

interface NavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSize?: string;
  onClick: () => void;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks: NavLink[] = [
    { label: 'Dashboard', icon: LayoutGrid, onClick: () => { nav.goToDashboard(); setIsOpen(false); } }
  ];

  const outgoingLinks: NavLink[] = [
    { label: 'Add New Package', icon: Package, onClick: () => { nav.goToOutgoingPackages(); setIsOpen(false); } }
  ];

  const incomingLinks: NavLink[] = [
    { label: 'Add New Package', icon: Package, onClick: () => { nav.goToIncomingPackages(); setIsOpen(false); } }
  ];

  const otherLinks: NavLink[] = [
    { label: 'View all packages', icon: PackageSearch, onClick: () => { nav.goToAllPackages(); setIsOpen(false); } },
    { label: 'Report', icon: ClipboardList, onClick: () => { nav.goToReport(); setIsOpen(false); } },
    { label: 'Entry & Exit Recording', icon: LogIn, onClick: () => { nav.goToEntryExitRecording(); setIsOpen(false); } },
    { label: 'Verify Outgoing Packages', icon: PackageOpen, iconSize: 'h-7 w-7', onClick: () => { nav.goToAllOutgoingPackages(); setIsOpen(false); } },
    { label: 'Verify Incoming Packages', icon: PackageCheck, iconSize: 'h-7 w-7', onClick: () => { nav.goToAllIncomingPackages(); setIsOpen(false); } },
    { label: 'Verify Holding Packages', icon: AlertCircle, iconSize: 'h-7 w-7', onClick: () => { nav.goToHoldingVerification(); setIsOpen(false); } },
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3 fixed top-0 w-full z-50">
        <div className="relative w-24 h-8">
          <Image
            src="/logo/essilor.png"
            alt="Essilor Logo"
            fill
            className="object-contain"
            loading="eager"
            sizes="96px"
          />
        </div>
        <button onClick={toggleSidebar} className="p-2 text-gray-600 focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed left-0 top-0 h-screen w-72 bg-[#e5e5e5] text-[#52525b] flex-col z-50 border-r border-gray-300 shadow-sm transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Logo Section */}
        <div className="bg-white p-6 flex justify-center items-center h-24 lg:h-32 shrink-0">
          <div className="relative w-40 h-20">
            <Image
              src="/logo/essilor.png"
              alt="Essilor Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 96px, 160px"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-0 py-6">
          <div className="px-4 mb-4">
            {navLinks.map((link) => {
              const isActive = pathname === nav.routes.DASHBOARD;
              return (
                <button key={link.label} onClick={link.onClick} className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${isActive ? 'text-[#6366f1]' : 'hover:bg-gray-200/80 hover:text-gray-900'}`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-12 bg-indigo-500/20 blur-xl -ml-4 rounded-full pointer-events-none" />}
                  <link.icon className={`h-6 w-6 z-10 ${isActive ? 'text-[#6366f1]' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className={`font-bold text-lg z-10 ${isActive ? 'opacity-100' : 'opacity-80'}`}>{link.label}</span>
                </button>
              );
            })}
          </div>

          <NavSection title="Outgoing Package" links={outgoingLinks} onItemClick={() => setIsOpen(false)} />
          <NavSection title="Incoming Package" links={incomingLinks} onItemClick={() => setIsOpen(false)} />
          
          <div className="mt-4 border-t border-gray-300/60 pt-4 space-y-1 px-4">
            {otherLinks.map((link) => (
              <SidebarItem key={link.label} link={link} onClick={() => setIsOpen(false)} />
            ))}
          </div>

          {/* Access Management Section */}
          <div className="mt-4 border-t border-gray-300/60 pt-4">
            <h3 className="px-8 text-[14px] font-semibold text-gray-500/80 uppercase tracking-wider mb-2">Administration</h3>
            <div className="px-4">
              <button
                onClick={() => { nav.goToAllUsers(); setIsOpen(false); }}
                className="w-full flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 group"
              >
                <Shield className="h-6 w-6 text-gray-800/90 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm opacity-90 group-hover:opacity-100">Access Management</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-8 mt-auto border-t border-gray-300/40">
          <button className="flex items-center justify-center gap-3 w-full group transition-all">
            <LogOut className="h-6 w-6 text-gray-600 group-hover:text-red-600 transition-colors" />
            <span className="font-semibold text-lg text-gray-600 group-hover:text-red-600 transition-colors">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavSection({ title, links, onItemClick }: { title: string, links: NavLink[], onItemClick: () => void }) {
  return (
    <div className="mt-4 border-t border-gray-300/60 pt-4">
      <h3 className="px-8 text-xs font-semibold text-gray-500/80 uppercase tracking-wider mb-2">{title}</h3>
      <div className="px-4">
        {links.map(link => (
          <SidebarItem key={link.label} link={link} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ link, onClick }: { link: NavLink, onClick: () => void }) {
  const iconSize = link.iconSize || 'h-6 w-6';
  return (
    <button onClick={() => { link.onClick(); onClick(); }} className="w-full flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 group">
      <link.icon className={`${iconSize} text-gray-800/90 group-hover:scale-110 transition-transform`} />
      <span className="font-bold text-sm opacity-90 group-hover:opacity-100">{link.label}</span>
    </button>
  );
}