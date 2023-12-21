import React from 'react'
//import { useSelector } from 'react-redux'
//import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'
import { PulseLoader } from 'react-spinners'
import { useGetAllUsersQuery } from '../users/usersApiSlice'

const NewNote = () => {
  //const users = useSelector(selectAllUsers)

  const { users } = useGetAllUsersQuery('usersList', {
    selectFromResult : ({ data }) => ({
      users : data?.ids.map(id => data?.entities[id])
    })
  })

  if(!users){
    return  <PulseLoader color={'#FFF'} />
  }

  const content = <NewNoteForm users={users}/>

  return content
}

export default NewNote