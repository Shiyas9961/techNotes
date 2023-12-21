import React, { useEffect } from 'react'
import {store} from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { notesApiSlice } from '../notes/notesApiSlice'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {


    useEffect(() => {
        /* console.log("Subscribing")
        const users = store.dispatch(usersApiSlice.endpoints.getAllUsers.initiate())
        const notes = store.dispatch(notesApiSlice.endpoints.getAllNotes.initiate()) */

        store.dispatch( usersApiSlice.util.prefetch( 'getAllUsers', 'usersList', { force : true }) )
        store.dispatch( notesApiSlice.util.prefetch( 'getAllNotes', 'notesList', { force : true }) )

        /* return () => {
            console.log("Unsubscribing")
            users.unsubscribe()
            notes.unsubscribe()
        } */
    },[])
  return <Outlet/>
}

export default Prefetch