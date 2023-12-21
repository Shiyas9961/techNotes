import React from 'react'
import EditNoteForm from './EditNoteForm'
import { useParams } from 'react-router-dom'
import { useGetAllNotesQuery } from './notesApiSlice'
import { useGetAllUsersQuery } from '../users/usersApiSlice'
import { PulseLoader } from 'react-spinners'
import useAuth from '../../hooks/useAuth'
//import { useSelector } from 'react-redux'
//import { selectNotesById } from './notesApiSlice'
//import { selectAllUsers } from '../users/usersApiSlice'

const EditNote = () => {

  const { id } = useParams()
  const { username, isManager, isAdmin } = useAuth()

  //const note = useSelector(state => selectNotesById(state, id))
  //const users = useSelector(selectAllUsers)

  const { note } = useGetAllNotesQuery('notesList', {
    selectFromResult : ({ data }) => ({
      note : data?.entities[id]
    })
  })

  const { users } = useGetAllUsersQuery('usersList', {
    selectFromResult : ({ data }) => ({
      users : data?.ids.map(id => data?.entities[id])
    }),
  })

  if(!note || !users?.length){
    return <PulseLoader color={'#FFF'} />
  }

  if(!isAdmin || !isManager){
    if(note.username !== username){
        return <p className='errmsg'>No Access</p>
    }
  }

  const content = <EditNoteForm users={users} note = {note} />

  return content
}

export default EditNote