import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
//import { useSelector } from 'react-redux'
//import { selectUsersById } from './usersApiSlice'
import { useGetAllUsersQuery } from './usersApiSlice'
import { memo } from 'react'

const Users = ({userId}) => {

    //const user = useSelector(state => selectUsersById(state, userId))

    const { user } = useGetAllUsersQuery( 'usersList', {
      selectFromResult : ({ data }) => ({
        user : data?.entities[userId]
      }),
    })

    const navigate = useNavigate()


  if(user){

    const handleEdit = () => {
        navigate(`/dash/users/${userId}`)
    }
    const rolesString = user.roles.toString().replaceAll(',', ', ')
    const cellStatus = user.active ? '' : 'table__cell--inactive'

    return (
        <tr className="table__row user">
            <td className={`table__cell ${cellStatus}`}>{user.username}</td>
            <td className={`table__cell ${cellStatus}`}>{rolesString}</td>
            <td className={`table__cell ${cellStatus}`}>
                <button className="icon__button table__button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenSquare}/>
                </button>
            </td>
        </tr>
    )
  }else{
    return null
  }
}

const memoizedUsers = memo(Users)
export default memoizedUsers