"use client";

import * as React from "react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Filtra per data...",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  // Initialize view date based on current value or today
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());

  // Format display label
  const formattedDisplay = React.useMemo(() => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const shortMonth = MONTH_NAMES[month]?.slice(0, 3) ?? "";
    return `${day} ${shortMonth} ${year}`;
  }, [value]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate calendar days
  const calendarCells = React.useMemo(() => {
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: Array<{
      day: number;
      monthOffset: number; // -1 = prev, 0 = curr, 1 = next
      dateStr: string;
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      cells.push({
        day: d,
        monthOffset: -1,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const m = currentMonth + 1;
      cells.push({
        day: d,
        monthOffset: 0,
        dateStr: `${currentYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Next month padding to fill complete rows of 7
    const remainder = cells.length % 7;
    if (remainder > 0) {
      const needed = 7 - remainder;
      for (let d = 1; d <= needed; d++) {
        const m = currentMonth === 11 ? 1 : currentMonth + 2;
        const y = currentMonth === 11 ? currentYear + 1 : currentYear;
        cells.push({
          day: d,
          monthOffset: 1,
          dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        });
      }
    }

    return cells;
  }, [currentMonth, currentYear]);

  const todayStr = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const handleSelect = (dateStr: string) => {
    onChange(dateStr);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    onChange(todayStr);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-9 px-3 text-xs rounded-xl border flex items-center justify-between gap-2.5 transition-all outline-none",
            "bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            value ? "text-white font-medium" : "text-neutral-400 font-normal",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{formattedDisplay ?? placeholder}</span>
          </div>

          {value && (
            <span
              role="button"
              onClick={handleClear}
              className="p-0.5 rounded-md hover:bg-neutral-700 text-neutral-400 hover:text-white shrink-0 cursor-pointer"
              title="Rimuovi filtro data"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white"
      >
        {/* HEADER: MONTH & YEAR NAVIGATION */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
          <button
            type="button"
            onClick={prevMonth}
            className="h-7 w-7 rounded-lg bg-neutral-800 hover:bg-neutral-750 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-xs font-bold text-white tracking-wide">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="h-7 w-7 rounded-lg bg-neutral-800 hover:bg-neutral-750 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* WEEKDAYS HEADER */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-[10px] font-semibold text-neutral-400 py-0.5">
              {w}
            </div>
          ))}
        </div>

        {/* DAYS GRID */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell) => {
            const isSelected = value === cell.dateStr;
            const isToday = todayStr === cell.dateStr;
            const isCurrentMonth = cell.monthOffset === 0;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => handleSelect(cell.dateStr)}
                className={cn(
                  "h-8 w-full rounded-lg text-xs font-medium flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                    : isToday
                    ? "border border-blue-500/50 text-blue-400 hover:bg-neutral-800"
                    : isCurrentMonth
                    ? "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                    : "text-neutral-600 hover:bg-neutral-800/40 hover:text-neutral-400"
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="h-7 px-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
          >
            Oggi
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-[11px] text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
            >
              Rimuovi filtro
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
