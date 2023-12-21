import React, { Fragment, useEffect, useState } from 'react'
import { useDeleteNoteMutation, useUpdateNoteMutation } from './notesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const EditNoteForm = ({ note, users }) => {

    const { isAdmin, isManager } = useAuth()
    
    const [
        updateNote,
        {
            isLoading,
            isError,
            isSuccess,
            error
        }
    ] = useUpdateNoteMutation()

    const [
        deleteNote,
        {
            isError : delIsError,
            isSuccess : delSuccess,
            error : delError
        }
    ] = useDeleteNoteMutation()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [user, setUser] = useState(note.user)
    const [completed, setCompleted] = useState(note.completed)
    const navigate = useNavigate()

    useEffect(()=>{
        if( isSuccess || delSuccess ){
            setTitle('')
            setText('')
            setUser('')
            navigate('/dash/notes')
        }
    },[isSuccess, delSuccess, navigate])

    const onTitleChange = (e) => setTitle(e.target.value)
    const onTextChange = (e) => setText(e.target.value)
    const onUserChange = (e) => setUser(e.target.value)
    const onCompltedChange = () => setCompleted(prev => !prev)

    let canSave = [user, title, text].every(Boolean) && !isLoading 

    const onUpdateClicked = async () => {
        if(canSave){
            await updateNote( { id : note.id, user, title, text, completed } )
        }
    }

    const onDeleteClicked = async () => {
        await deleteNote( { id : note.id } )
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', {day : "numeric", month : "long", year : "numeric", hour : "numeric", minute : "numeric", second : "numeric"})

    const updated = new Date(note.updatedAt).toLocaleString('en-US', {day : "numeric", month : "long", year : "numeric", hour : "numeric", minute : "numeric", second : "numeric"})

    const options = users.map(each => {
        return (
            <option value={each.id} key={each.id}>{each.username}</option>
        )
    })

    const errCls = ( isError || delIsError ) ? "errmsg" : "offscreen"
    const validTitleCls = !title ? "form__input--incomplete" : ""
    const validTextCls = !title ? "form__input--incomplete" : ""

    const errContent = ( error?.data?.message || delError?.data?.message ) ?? ''

    let deleteButton = null
    if(isAdmin || isManager){
        deleteButton = (
            <button
                className='icon-button'
                title='Delete'
                onClick={onDeleteClicked} 
            >
                <FontAwesomeIcon icon={faTrashCan}/>
            </button>
        )
    }

    const content = (
        <Fragment>
            <p className={errCls}>{errContent}</p>

            <form className='form' onSubmit={(e) => e.preventDefault()}>
                <div className='form__title-row'>
                    <h2>Edit Note</h2>
                    <div className='form__action-button'>
                        <button 
                            className='icon-button' 
                            title='Save' 
                            disabled={!canSave}
                            onClick={onUpdateClicked}
                        >
                            <FontAwesomeIcon icon={faSave}/>
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label htmlFor="title" className='form__label'>
                    Title : 
                </label>
                <input 
                    type="text"
                    value={title}
                    id='title'
                    name='title'
                    className={`form__input ${validTitleCls}`}
                    onChange={onTitleChange}
                />
                <label htmlFor="text">
                    Text : 
                </label>
                <textarea 
                    type="text"
                    value={text}
                    id='text'
                    name='text'
                    className={`form__input form__input--text ${validTextCls}`}
                    onChange={onTextChange} 
                />
                <div className='form__row'>
                    <div className='form__divider'>
                        <label htmlFor="comp" className='form__label form__check-container'>
                            WORK COMPLETE : 
                            <input 
                                type="checkbox"
                                checked={completed}
                                onChange={onCompltedChange}
                                id='comp'
                                name='comp'
                                className='form__checkbox' 
                            />
                        </label>
                        <label htmlFor="userId" className='form__label'>
                            Users
                        </label>
                        <select 
                            name="userId" 
                            id="userId"
                            className= 'form__select'
                            onChange={onUserChange}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className='form__created'>Created : <br />{created}</p>
                        <p className='form__updated'>Updated : <br />{updated}</p>
                    </div>
                </div>    
            </form>
        </Fragment>
    )
  return content
}

export default EditNoteForm