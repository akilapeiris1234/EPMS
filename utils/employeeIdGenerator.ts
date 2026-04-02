const EMPLOYEE_ID_STORAGE = "employeeIdCounter";

function generateChecksum(input: string): string {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i);
  }
  return (sum % 10).toString();
}

export function generateEmployeeId(): string {
  // Get prefix "EMP"
  const prefix = "EMP";

  // Get timestamp component (year + month + day)
  const now = new Date();
  const yearMonth = now.getFullYear().toString().slice(-2) + 
                    String(now.getMonth() + 1).padStart(2, "0");
  
  // Get sequential counter
  let counter = 1;
  if (typeof window !== "undefined" && window.localStorage) {
    const storedCounter = localStorage.getItem(EMPLOYEE_ID_STORAGE);
    counter = storedCounter ? parseInt(storedCounter, 10) + 1 : 1;
    localStorage.setItem(EMPLOYEE_ID_STORAGE, String(counter));
  }
  
  const sequentialPart = String(counter).padStart(5, "0");
  
  // Generate random component for additional uniqueness
  const randomPart = Math.floor(Math.random() * 90) + 10; // 10-99
  
  // Combine parts
  const baseId = `${prefix}${yearMonth}${sequentialPart}${randomPart}`;
  
  // Add checksum digit
  const checksum = generateChecksum(baseId);
  
  return `${baseId}${checksum}`;
}
