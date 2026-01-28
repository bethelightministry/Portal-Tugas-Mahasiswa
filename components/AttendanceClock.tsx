
import React, { useState, useEffect } from 'react';

const AttendanceClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-2xl shadow-lg border-4 border-blue-400">
      <div className="text-sm font-medium uppercase tracking-widest opacity-80 mb-1">Jam Absensi Real-time</div>
      <div className="text-4xl font-bold font-mono">
        {time.toLocaleTimeString('id-ID', { hour12: false })}
      </div>
      <div className="text-xs mt-2 opacity-90">
        {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

export default AttendanceClock;
