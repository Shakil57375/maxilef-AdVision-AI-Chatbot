import React, { useState } from 'react';

export default function CalendarModal({ onSelectDate, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Assuming you're using a basic input date
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Select Date</h2>
        <input 
          type="date" 
          value={selectedDate || ''} 
          onChange={handleDateChange} 
          className="border p-2 rounded mb-4"
        />
        <div className="flex justify-between">
          <button onClick={onClose} className="text-red-500">Cancel</button>
          <button onClick={handleConfirm} className="text-blue-500">Confirm</button>
        </div>
      </div>
    </div>
  );
}
