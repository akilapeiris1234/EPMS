"use client";

import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// ROUTE DEFINITIONS
export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: "/login",
  },
  
  // Package Routes
  PACKAGES: {
    ALL: "/pages/AllPackage",
    INCOMING: "/pages/IncomingPackage",
    OUTGOING: "/pages/OutgoingPackage",
    ALL_INCOMING: "/pages/AllIncomingPackage",
    ALL_OUTGOING: "/pages/AllOutgoingPackage",
  },

  // Package Details Route
  PACKAGE_DETAILS: {
    INCOMING: "/pages/AllPackage/IncomingPackageDetails",
    OUTGOING: "/pages/AllPackage/OutgoingPackageDetails",
  },

  // Package Update Routes
  PACKAGE_UPDATE: {
    INCOMING: "/pages/AllPackage/UpdatePackagePage/IncomingPackageUpdate",
    OUTGOING: "/pages/AllPackage/UpdatePackagePage/OutgoingPackageUpdate",
  },
  
  // Verification Routes
  VERIFICATION: {
    INCOMING: "/pages/IncomingPackageVerification",
    OUTGOING: "/pages/OutgoingPackageVerification",
    HOLDING: "/pages/VerifyHoldingPackages",
  },
  
  // Admin Routes
  ADMIN: {
    ADD_USER: "/Admin/AddUser",
    ALL_USERS: "/Admin/AllUsers",
    CONTROL_USER: "/Admin/ControlUser",
    DELETE_USER: "/Admin/DeleteUser",
    ADD_PACKAGE: "/Admin/AddPackage",
  },
  
  // Other Routes
  DASHBOARD: "/pages/Dashbaord",
  REPORT: "/pages/Report",
  ENTRY_EXIT_RECORDING: "/pages/EntryExitRecording",
} as const;



// NAVIGATION HOOK
export function useNavigation() {
  const router: AppRouterInstance = useRouter();

  return {
    // Direct route access
    routes: ROUTES,
    
    // Router instance
    router,
    
    // Navigation helpers
    goToLogin: () => router.push(ROUTES.AUTH.LOGIN),
    goToIncomingPackages: () => router.push(ROUTES.PACKAGES.INCOMING),
    goToOutgoingPackages: () => router.push(ROUTES.PACKAGES.OUTGOING),
    goToAllPackages: () => router.push(ROUTES.PACKAGES.ALL),
    goToAllIncomingPackages: () => router.push(ROUTES.PACKAGES.ALL_INCOMING),
    goToAllOutgoingPackages: () => router.push(ROUTES.PACKAGES.ALL_OUTGOING),
    goToIncomingPackageDetails: () => router.push(ROUTES.PACKAGE_DETAILS.INCOMING),
    goToOutgoingPackageDetails: () => router.push(ROUTES.PACKAGE_DETAILS.OUTGOING),
    goToIncomingPackageUpdate: () => router.push(ROUTES.PACKAGE_UPDATE.INCOMING),
    goToOutgoingPackageUpdate: () => router.push(ROUTES.PACKAGE_UPDATE.OUTGOING),
    goToDashboard: () => router.push(ROUTES.DASHBOARD),
    goToIncomingVerification: (packageId?: string) => {
      const url = packageId 
        ? `${ROUTES.VERIFICATION.INCOMING}?id=${packageId}`
        : ROUTES.VERIFICATION.INCOMING;
      router.push(url);
    },
    goToOutgoingVerification: (packageId?: string) => {
      const url = packageId 
        ? `${ROUTES.VERIFICATION.OUTGOING}?id=${packageId}`
        : ROUTES.VERIFICATION.OUTGOING;
      router.push(url);
    },
    goToHoldingVerification: () => router.push(ROUTES.VERIFICATION.HOLDING),
    goToReport: () => router.push(ROUTES.REPORT),
    goToEntryExitRecording: () => router.push(ROUTES.ENTRY_EXIT_RECORDING),
    goToAddUser: () => router.push(ROUTES.ADMIN.ADD_USER),
    goToAllUsers: () => router.push(ROUTES.ADMIN.ALL_USERS),
    goToControlUser: () => router.push(ROUTES.ADMIN.CONTROL_USER),
    goToDeleteUser: () => router.push(ROUTES.ADMIN.DELETE_USER),
    goToAddPackage: () => router.push(ROUTES.ADMIN.ADD_PACKAGE),
  };
}
