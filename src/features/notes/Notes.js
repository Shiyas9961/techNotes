import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare, } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetAllNotesQuery } from './notesApiSlice'
//import { selectNotesById } from './notesApiSlice'
//import { useSelector } from 'react-redux'
import { memo } from 'react'

const Notes = ({ noteId }) => {

    //const note = useSelector(state => selectNotesById(state, noteId))

    const { note } = useGetAllNotesQuery( 'notesList', {
        selectFromResult : ({ data }) => ({
            note : data?.entities[noteId]
        }),
    })

    const navigate = useNavigate()


    if(note){
        const created = new Date(note.createAt).toLocaleDateString('eng-US',{ day : 'numeric', month : 'long' })
        const updated = new Date(note.updatedAt).toLocaleDateString('eng-US',{ day : 'numeric', month : 'long' })

        const handleEdit = () => {
            navigate(`/dash/notes/${noteId}`)
        }
        return (
            <tr className='table__row'>
                <td className='table__cell note__status'>
                    {
                        note.completed ? (
                            <span className='note__status--completed'>Completed</span>
                        ) : <span className='note__status--open'>Open</span>
                    }
                </td>
                <td className='table__cell note__created'>{created}</td>
                <td className='table__cell note__updated'>{updated}</td>
                <td className='table__cell note__title'>{note.title}</td>
                <td className='table__cell note__username'>{note.username}</td>
                <td className='table__cell'>
                    <button className='icon-button table__button' onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenSquare}/>
                    </button>
                </td>
            </tr>
        )
    }else{
        return null
    }
}

const memoizedNotes = memo(Notes)
export default memoizedNotes