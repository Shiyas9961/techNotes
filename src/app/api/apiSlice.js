import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl : "https://techNotes-api.onrender.com",
    credentials : 'include',
    prepareHeaders : ( headers, { getState } ) => {
        const token = getState().auth.token

        if(token){
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const fetchBaseQueryWithReAuth = async (args, api, extraOptions) => {
    //console.log(url) // request url, method, body
    //console.log(arg) // signal, dispatch, getState()
    //console.log(extraOptions) // custome like { shoute : true }


    let result = await baseQuery(args, api, extraOptions)

    //If you want to handle, other status code too,
    if(result?.error?.status === 403){

        console.log("sending refresh token")

        //sending refreshToken to get new access Token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data){

            //store the new accessToken
            api.dispatch(setCredentials({ ...refreshResult.data }))

            //retry original query with new accessToken
            result = await baseQuery(args, api, extraOptions)
        }else{

            if(refreshResult?.error?.status === 403){
                refreshResult.error.data.message = "Login has expired"
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery : fetchBaseQueryWithReAuth,
    tagTypes : ["Notes","Users"],
    endpoints : builder => ({})
})