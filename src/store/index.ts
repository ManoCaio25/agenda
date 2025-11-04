import { configureStore } from "@reduxjs/toolkit";
import agendaReducer from "./agendaSlice";
import { agendaApi } from "../services/agendaApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    agenda: agendaReducer,
    [agendaApi.reducerPath]: agendaApi.reducer, // <- OBRIGATÓRIO
  },
  middleware: (getDefault) =>
    getDefault().concat(agendaApi.middleware),    // <- OBRIGATÓRIO
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
