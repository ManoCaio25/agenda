import { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGetTasksQuery } from "../services/agendaApi";

export default function CalendarPage() {
  const { data: tasks } = useGetTasksQuery();

  const events = useMemo(
    () =>
      (tasks ?? [])
        .filter((t) => !!t.date)
        .map((t) => ({
          id: t.id,
          title: t.title + (t.done ? " ✅" : ""),
          start: t.date,
        })),
    [tasks]
  );

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Calendário</Typography>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        events={events}
        height="75vh"
      />
    </Paper>
  );
}
