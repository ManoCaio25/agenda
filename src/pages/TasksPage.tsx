import { Container, Paper, Typography } from "@mui/material";
import AgendaBlock from "../components/AgendaBlock";

export default function TasksPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Meus compromissos
        </Typography>
        <AgendaBlock />
      </Paper>
    </Container>
  );
}
