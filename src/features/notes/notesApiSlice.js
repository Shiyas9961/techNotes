import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter({
    sortComparer : (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({
        getAllNotes : builder.query({
            query : () => ({
                url : "/notes",
                validateStatus : (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse : response => {
                const convNotes = response.map(note => {
                    note.id = note._id

                    return note
                })
                return notesAdapter.setAll(initialState, convNotes)
            },
            providesTags : (res, err, arg) => {
                if(res?.ids){
                    return [
                        { type : "Notes", id : "LIST"},
                        ...res.ids.map(id => ({type : "Users", id}))
                    ]
                }else {
                    return [
                        { type : "Notes", id : "LIST" }
                    ]
                }
            }
        }),
        addNewNote : builder.mutation({
            query : (credentials) => ({
                url : "/notes",
                method : "POST",
                body : {
                    ...credentials
                }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Notes", id : "LIST" }
            ]
        }),
        updateNote : builder.mutation({
            query : (credentials) => ({
                url : "/notes",
                method : "PATCH",
                body : {
                    ...credentials
                }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Notes", id : arg.id }
            ]
        }),
        deleteNote : builder.mutation({
            query : ({ id }) => ({
                url : "/notes",
                method : "DELETE",
                body : { id }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Notes", id : arg.id }
            ]
        })
    })
})

export const {
    useGetAllNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice

const selectNotesResult = notesApiSlice.endpoints.getAllNotes.select()

const selectNotesData = createSelector(selectNotesResult, (notesResult) => notesResult.data)

export const {
    selectAll : selectAllNotes,
    selectById : selectNotesById,
    selectIds : selectNotesId
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)