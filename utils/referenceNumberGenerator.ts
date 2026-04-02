/**
 * Reference Number Generator
 * Generates sequential reference numbers for packages with daily reset logic
 */

const STORAGE_KEY = "referenceNumberCounter";
const DATE_KEY = "referenceNumberDate";
const TIME_KEY = "referenceNumberTime";

export function generateReferenceNumber(): string {
  // Get current date and time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const dateString = `${year}${month}${date}`;
  const currentTimeString = `${hours}${minutes}`;

  // Get stored date and counter from localStorage
  let storedDate = "";
  let counter = 0;

  if (typeof window !== "undefined" && window.localStorage) {
    storedDate = localStorage.getItem(DATE_KEY) || "";
    const storedCounter = localStorage.getItem(STORAGE_KEY);
    
    // Reset counter if date has changed
    if (storedDate !== dateString) {
      counter = 0;
      localStorage.setItem(DATE_KEY, dateString);
    } else {
      counter = storedCounter ? parseInt(storedCounter, 10) : 0;
    }
    
    // Increment counter by 1 and store
    counter += 1;
    localStorage.setItem(STORAGE_KEY, String(counter));
    // Always update time with current time
    localStorage.setItem(TIME_KEY, currentTimeString);
  } else {
    // Fallback for server-side or when localStorage is unavailable
    counter = Math.floor(Math.random() * 9000) + 1000;
  }

  const paddedCounter = String(counter).padStart(5, "0");
  
  return `${dateString}-${currentTimeString}-${paddedCounter}`;
}


