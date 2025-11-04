import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// src/services/agendaApi.ts
const BASE_URL = "https://690a09b51a446bb9cc211919.mockapi.io/agenda/";


export interface TaskDTO {
  id: string;
  title: string;
  date?: string;
  done: boolean;
}

export const agendaApi = createApi({
  reducerPath: "agendaApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    // GET /events
    getTasks: builder.query<TaskDTO[], void>({
      query: () => "/events",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),

    // POST /events
    addTask: builder.mutation<TaskDTO, Partial<TaskDTO>>({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    // PUT /events/:id
    updateTask: builder.mutation<TaskDTO, { id: string; data: Partial<TaskDTO> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, arg) => [{ type: "Tasks", id: arg.id }],
    }),

    // DELETE /events/:id
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, id) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = agendaApi;
