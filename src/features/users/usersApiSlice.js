import { apiSlice } from "../../app/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({
        getAllUsers : builder.query({
            query : () => ({
                url : '/users',
                validateStatus : (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse : response => {
                const convUsers = response.map(user => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, convUsers)
            },
            providesTags : (res, err, arg) => {
                if(res?.ids){
                    return [
                        { type: "Users", id : "LIST" },
                        ...res.ids.map(id => ({type : "Users", id}))
                    ]
                }else return [
                    {type : "Users", id : "LIST"}
                ]
            }
        }),
        addNewUser : builder.mutation({
            query : (credentials) => ({
                url : "/users",
                method : "POST",
                body : {
                    ...credentials
                }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Users", id : "LIST" }
            ]
        }),
        updateUser : builder.mutation({
            query : (credentials) => ({
                url : "users",
                method : "PATCH",
                body : {
                    ...credentials
                }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Users", id : arg.id }
            ]
        }),
        deleteUser : builder.mutation({
            query : ({ id }) => ({
                url : "/users",
                method : "DELETE",
                body : { id }
            }),
            invalidatesTags : (res, err, arg) => [
                { type : "Users", id : arg.id }
            ]
        })
    })
})

export const {
    useGetAllUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getAllUsers.select()

const selectUserData = createSelector(selectUsersResult, (usersResult)=> usersResult.data)

export const {
    selectAll : selectAllUsers,
    selectById : selectUsersById,
    selectIds : selectUserId,
} = usersAdapter.getSelectors( state => selectUserData(state) ?? initialState )

