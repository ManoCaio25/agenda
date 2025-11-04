import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, IconButton
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const drawerWidth = 240;

export default function MainLayout() {
  const [open, setOpen] = useState(true);
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            Agenda • Caio
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 72,
            boxSizing: "border-box",
            transition: "width .2s",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton
            component={Link}
            to="/tasks"
            selected={pathname.startsWith("/tasks")}
          >
            <ListItemIcon><EventNoteIcon /></ListItemIcon>
            <ListItemText primary="Tarefas" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/calendar"
            selected={pathname.startsWith("/calendar")}
          >
            <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
            <ListItemText primary="Calendário" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
