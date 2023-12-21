import React from 'react'
import Notes from './Notes';
import { useGetAllNotesQuery } from './notesApiSlice';
import useAuth from '../../hooks/useAuth';
import { PulseLoader } from 'react-spinners';

const NotesList = () => {
  const { username ,isAdmin, isManager } = useAuth()

  const {
    isError,
    isLoading,
    isSuccess,
    error,
    data : notes
  } = useGetAllNotesQuery( 'notesList',{
    pollingInterval : 15000,
    refetchOnFocus : true,
    refetchOnMountOrArgChange : true
  })

  let content;

  if(isLoading){
    content = <PulseLoader color={'#FFF'}/>
  }

  if(isError){
    content = <p className='errmsg'>{error?.data?.message}</p>
  }

  if(isSuccess){
      const { ids, entities } = notes

      let filteredIds;

      if(isManager || isAdmin){
        filteredIds = [ ...ids ]
      }else{
        filteredIds = ids.filter(noteId => entities[noteId].username === username )
      }

      const notesBody = ids?.length && (
        filteredIds.map(noteId => <Notes key={noteId} noteId={noteId}/>)
        )

     content = (
      <table className='table table--notes'>
        <thead className='table__thead'>
          <tr >
            <th scope='col' className='table__th note__status'>Username</th>
            <th scope='col' className='table__th note__created'>Created</th>
            <th scope='col' className='table__th note__updated'>Updated</th>
            <th scope='col' className='table__th note__title'>Title</th>
            <th scope='col' className='table__th note__username'>Owner</th>
            <th scope='col' className='table__th note__edit'>Edit</th>
          </tr>
        </thead>
        <tbody>
          {notesBody}
        </tbody>
      </table>
     )
  }

  return content
}

export default NotesList