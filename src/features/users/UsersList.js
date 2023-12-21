import { PulseLoader } from 'react-spinners'
import { useGetAllUsersQuery } from '../users/usersApiSlice'
import Users from './Users'

const UsersList = () => {


  const {
    isError,
    isLoading,
    isSuccess,
    error,
    data : users
  } = useGetAllUsersQuery( 'usersList', {
    pollingInterval : 60000,
    refetchOnFocus : true,
    refetchOnMountOrArgChange : true
  })

  let content

  if(isLoading){
    content = <PulseLoader color={'#FFF'}/>
  }
  if(isError){
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if(isSuccess){
    const { ids } = users
    
    const tableContent = ids?.length && (
      ids.map(userId => <Users key={userId} userId={userId} />)
    )

    content = (
      <table className='table table--users'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th user__username'>Username</th>
            <th scope='col' className='table__th user__roles'>Roles</th>
            <th scope='col' className='table__th user__edit'>Edit</th>
          </tr>
        </thead>
        <tbody>
            {tableContent}
        </tbody>
      </table>
    )
  }

  return content
}

export default UsersList