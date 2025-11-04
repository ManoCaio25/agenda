import { useState } from "react";
import {
  TextField, Button, List, ListItem, ListItemText,
  IconButton, Checkbox, Stack, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

import AlertSnackbar from "./AlertSnackbar";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../services/agendaApi";

export default function AgendaBlock() {
  const [input, setInput] = useState("");
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState<"success" | "error" | "info" | "warning">("success");

  // Hooks da API
  const { data: tasks, isLoading, isError } = useGetTasksQuery();
  const [addTask, { isLoading: adding }] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  function showSnack(msg: string, type: "success" | "error" | "info" | "warning" = "success") {
    setSnackMsg(msg);
    setSnackType(type);
    setSnackOpen(true);
  }

  async function handleAdd() {
    const title = input.trim();
    if (!title) return showSnack("Digite um compromisso.", "warning");
    try {
      await addTask({
        title,
        date: dateTime?.toISOString(),
        done: false,
      }).unwrap();
      setInput("");
      setDateTime(null);
      showSnack("Compromisso criado!");
    } catch {
      showSnack("Erro ao criar compromisso.", "error");
    }
  }

  async function handleToggle(id: string, done: boolean) {
    try {
      await updateTask({ id, data: { done: !done } }).unwrap();
      showSnack("Status atualizado.", "info");
    } catch {
      showSnack("Erro ao atualizar status.", "error");
    }
  }

  async function handleEdit(id: string, currentTitle: string) {
    const novoTitulo = prompt("Novo título:", currentTitle);
    const title = (novoTitulo ?? "").trim();
    if (!title) return;
    try {
      await updateTask({ id, data: { title } }).unwrap();
      showSnack("Compromisso atualizado.", "success");
    } catch {
      showSnack("Erro ao atualizar.", "error");
    }
  }

  async function handleRemove(id: string) {
    try {
      await deleteTask(id).unwrap();
      showSnack("Compromisso removido.", "success");
    } catch {
      showSnack("Erro ao remover.", "error");
    }
  }

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Falha ao carregar. Verifique a BASE_URL da API.</div>;

  return (
    <>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Novo compromisso"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <DateTimePicker
          label="Data e hora"
          value={dateTime}
          onChange={(v) => setDateTime(v)}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <Button variant="contained" onClick={handleAdd} disabled={adding}>
          {adding ? "Salvando..." : "Adicionar"}
        </Button>

        <List>
          {(tasks ?? []).map((t) => (
            <ListItem
              key={t.id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(t.id, t.title)} aria-label="editar">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleRemove(t.id)} aria-label="remover">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <Checkbox checked={t.done} onChange={() => handleToggle(t.id, t.done)} />
              <ListItemText
                primary={t.title}
                secondary={t.date ? dayjs(t.date).format("DD/MM/YYYY HH:mm") : "Sem data"}
                sx={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Stack>

      <AlertSnackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
        severity={snackType}
      />
    </>
  );
}
