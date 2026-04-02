"use client";

import { useEffect, useState } from "react";

export default function DateTime() {
  const [dateTime, setDateTime] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    // Function to update date and time
    const updateDateTime = () => {
      const now = new Date();

      // Format time as HH:MM:SS AM/PM
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const timeString = `${displayHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;

      // Format date as MM-DD-YYYY
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const date = now.getDate().toString().padStart(2, "0");
      const year = now.getFullYear();
      const dateString = `${month}-${date}-${year}`;

      setDateTime({ time: timeString, date: dateString });
    };

    // Update immediately
    updateDateTime();

    // Update every second for real-time changes
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!dateTime) {
    return (
      <div className="flex gap-4">
        <div className="bg-white px-6 py-2 rounded-md shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
          --:-- --
        </div>
        <div className="bg-white px-6 py-2 rounded-md shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
          --/--/----
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <div className="bg-white px-4 sm:px-6 py-2 rounded-md shadow-sm border border-gray-100 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
        {dateTime.time}
      </div>
      <div className="bg-white px-4 sm:px-6 py-2 rounded-md shadow-sm border border-gray-100 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
        {dateTime.date}
      </div>
    </div>
  );
}