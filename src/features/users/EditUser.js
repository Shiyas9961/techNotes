import React from 'react'
//import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
//import { selectUsersById } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import { useGetAllUsersQuery } from './usersApiSlice'
import { PulseLoader } from 'react-spinners'

const EditUser = () => {

  const { id } = useParams()

  //const user = useSelector((state) => selectUsersById(state, id))

  const { user } = useGetAllUsersQuery('usersList', {
    selectFromResult : ({ data }) => ({
      user : data?.entities[id]
    })
  })

  if(!user){
    return <PulseLoader color={'#fff'} />
  }


  const content = <EditUserForm user={user}/>

  return content
}

export default EditUser