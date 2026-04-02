import { ReportPackage } from "./formTypes";

export const generateReportCSV = (filteredPackages: ReportPackage[]) => {
  const headers = filteredPackages[0]?.type === "Incoming"
    ? ["Track Number(s)", "Reference Number", "Type", "Mode", "Customer", "Employee Name", "Employee ID", "Department", "Delivery Company", "Delivery Person Name", "Vehicle Number", "Vehicle Type", "Receive Date", "Receive Time", "Collected Time"]
    : ["Track Number(s)", "Reference Number", "Type", "Mode", "Customer", "Employee Name", "Employee ID", "Department", "Delivery Company", "Delivery Person Name", "Vehicle Number", "Vehicle Type", "Dispatch Date", "Dispatch Time", "Delivery Date", "Delivery Time"];
  
  const rows = filteredPackages.map(pkg => {
    // For batch mode, show all tracking numbers; for single mode, just show the id
    const trackingNumbers = pkg.mode === "batch" && pkg.trackingNumbers?.length
      ? pkg.trackingNumbers.join("; ")
      : pkg.id;

    if (pkg.type === "Incoming") {
      return [trackingNumbers, pkg.referenceNumber || "", pkg.type, pkg.mode, pkg.customer, pkg.employee, pkg.employeeId, pkg.department, pkg.deliveryCompany, pkg.deliveryPersonName, pkg.vehicleNumber, pkg.vehicleType, pkg.receiveDate, pkg.receiveTime, pkg.collectedTime];
    } else {
      return [trackingNumbers, pkg.referenceNumber || "", pkg.type, pkg.mode, pkg.customer, pkg.employee, pkg.employeeId, pkg.department, pkg.deliveryCompany, pkg.deliveryPersonName, pkg.vehicleNumber, pkg.vehicleType, pkg.dispatchDate, pkg.dispatchTime, pkg.deliveryDate, pkg.deliveryTime];
    }
  });

  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
};
