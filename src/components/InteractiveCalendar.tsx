import React, { useState } from "react";
import { Appointment } from "../types";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface InteractiveCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  appointments: Appointment[];
  onAddAppointmentClick: () => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  selectedDate,
  onSelectDate,
  appointments,
  onAddAppointmentClick,
}) => {
  // Parse currently displayed month/year
  const [currentYear, setCurrentYear] = useState<number>(() => {
    const d = new Date(selectedDate || "2026-05-20");
    return isNaN(d.getTime()) ? 2026 : d.getFullYear();
  });

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const d = new Date(selectedDate || "2026-05-20");
    return isNaN(d.getTime()) ? 4 : d.getMonth(); // 0-indexed (May = 4)
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Generate calendar grid cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYearNum = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYearNum}-${String(prevMonthIdx + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    calendarCells.push({ dayNum, isCurrentMonth: false, dateStr });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({ dayNum: day, isCurrentMonth: true, dateStr });
  }

  // Next month leading days (fill grid to 35 or 42 cells)
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYearNum = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYearNum}-${String(nextMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({ dayNum: day, isCurrentMonth: false, dateStr });
  }

  // Appointments for the selected date
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate);

  // Format display date
  const formattedSelectedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
      {/* Calendar Month Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span>{monthNames[currentMonth]} {currentYear}</span>
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onAddAppointmentClick}
            className="ml-2 p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            title="Add Appointment"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[10px] font-bold text-slate-400">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {calendarCells.map((cell, idx) => {
          const isSelected = cell.dateStr === selectedDate;
          const hasApt = appointments.some((a) => a.date === cell.dateStr);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`relative py-2 rounded-xl font-medium transition-all flex flex-col items-center justify-center ${
                !cell.isCurrentMonth
                  ? "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
                  : isSelected
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 scale-105"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span>{cell.dayNum}</span>
              {hasApt && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />
              )}
              {hasApt && isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Today's Schedule for Selected Date */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Schedule for Selected Date
            </h4>
            <p className="text-[10px] text-slate-500">{formattedSelectedDate}</p>
          </div>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">
            {dayAppointments.length} Appointments
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Clock className="w-6 h-6 text-slate-300 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-medium">No appointments on this date</p>
              <button
                onClick={onAddAppointmentClick}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700 transition-colors"
              >
                + Schedule Patient
              </button>
            </div>
          ) : (
            dayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-1 rounded-md shrink-0">
                    {apt.time}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{apt.patientName}</h5>
                    <p className="text-[10px] text-slate-500">{apt.type}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    apt.status === "Confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : apt.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {apt.status === "Confirmed" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {apt.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
