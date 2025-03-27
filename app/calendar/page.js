"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import { sampleContests } from "../lib/sampleData";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);

  // Transform contests into calendar events
  const events = sampleContests.map((contest) => {
    const color = {
      leetcode: "#FFA116",
      codeforces: "#318CE7",
      codechef: "#1FA34B",
    }[contest.platform.toLowerCase()];

    return {
      title: contest.title,
      start: contest.startTime,
      end: contest.startTime, // You might want to calculate end time based on duration
      backgroundColor: color + "20",
      borderColor: color + "40",
      textColor: color,
      extendedProps: {
        platform: contest.platform,
        duration: contest.duration,
        status: contest.status,
      },
    };
  });

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    // You can implement highlighting or navigation here
  };

  const handleEventClick = (arg) => {
    // Navigate to contest page with the contest highlighted
    router.push("/?highlight=" + encodeURIComponent(arg.event.title));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white/90">Contest Calendar</h1>

      <div className="rounded-2xl bg-[#1a1b1e]/95 border border-white/[0.05] p-6 shadow-xl backdrop-blur-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          themeSystem="standard"
          dayMaxEvents={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }}
          // Custom styling
          className="contest-calendar"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
        />
      </div>

      {/* Custom styles for the calendar */}
      <style jsx global>{`
        .contest-calendar {
          --fc-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-text-color: #fff;
          --fc-button-bg-color: rgba(255, 255, 255, 0.1);
          --fc-button-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-hover-bg-color: rgba(255, 255, 255, 0.2);
          --fc-button-hover-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-active-bg-color: rgba(255, 255, 255, 0.3);
          --fc-button-active-border-color: rgba(255, 255, 255, 0.3);
          --fc-event-bg-color: rgba(255, 255, 255, 0.1);
          --fc-event-border-color: rgba(255, 255, 255, 0.2);
          --fc-event-text-color: #fff;
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.05);
          --fc-neutral-text-color: rgba(255, 255, 255, 0.7);
          --fc-today-bg-color: rgba(255, 255, 255, 0.05);
        }

        .contest-calendar .fc-theme-standard td,
        .contest-calendar .fc-theme-standard th {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .contest-calendar .fc-day-today {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .contest-calendar .fc-button {
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .contest-calendar .fc-button-active {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .contest-calendar .fc-event {
          border-radius: 0.5rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .contest-calendar .fc-event:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .contest-calendar .fc-toolbar-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.25rem !important;
          font-weight: 600;
        }

        .contest-calendar .fc-col-header-cell {
          padding: 0.75rem 0;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .contest-calendar .fc-daygrid-day-number {
          color: rgba(255, 255, 255, 0.7);
          padding: 0.5rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
