
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Task {
  id: string;       
  title: string;   
  done: boolean;    
  date?: string;    
}


interface AgendaState {
  tasks: Task[];
}

const initialState: AgendaState = {
  tasks: [],
};


const uid = () => Math.random().toString(36).slice(2, 9);


const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string; date?: string }>) => {
      state.tasks.push({
        id: uid(),
        title: action.payload.title,
        date: action.payload.date,
        done: false,
      });
    },
    removeTask: (state, action: PayloadAction<{ id: string }>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload.id);
    },
    toggleDone: (state, action: PayloadAction<{ id: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) task.done = !task.done;
    },
    editTask: (state, action: PayloadAction<{ id: string; title: string; date?: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        if (action.payload.date !== undefined) task.date = action.payload.date;
      }
    },
  },
});


export const { addTask, removeTask, toggleDone, editTask } = agendaSlice.actions;


export default agendaSlice.reducer;


