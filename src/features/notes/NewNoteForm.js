import React, { Fragment, useEffect, useState } from 'react'
import { useAddNewNoteMutation } from './notesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const NewNoteForm = ({users}) => {
    const [
        addNewNote,
        {
            isError,
            isLoading,
            isSuccess,
            error
        }
    ] = useAddNewNoteMutation()


    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [user, setUser] = useState('')
    const navigate = useNavigate()

    const onTitleChange = (e) => setTitle(e.target.value)
    const onTextChange  = (e) => setText(e.target.value)

    const onUserChange = (e) => setUser(e.target.value)

    let canSave = [title, text, user ].every(Boolean) && !isLoading

    useEffect(() => {
        if(isSuccess){
            setTitle('')
            setText('')
            setUser('')
            navigate('/dash/notes')
        }
    },[isSuccess, navigate])

    const onSaveNewNote = async (e) => {
        e.preventDefault()
        if(canSave){
            await addNewNote({ user, title, text })
        }
    }

    const options = users.map(user => {
        return (
            <option key={user.id} value={user.id}>{user.username}</option>
        )
    })

    const errCls = isError ? "errmsg" : "offscreen"
    const validTitleCls = !title ? 'form__input--incomplete' : ''
    const validTextCls = !text ? 'form__input--incomplete' : ''    


    const content = (
        <Fragment>
            <p className={errCls}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveNewNote}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className='form__action-buttons'>
                        <button className='icon-button' title="save" disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave}/>
                        </button>
                    </div>
                </div>
                <label htmlFor="title" className='form__label'>
                    Title : 
                </label>
                <input 
                    type="text"
                    id='title'
                    name='title'
                    onChange={onTitleChange}
                    value={title}
                    className={`form__input ${validTitleCls}`}
                />
                <label htmlFor="text" className='form__label'>
                    Text : 
                </label>
                <textarea 
                    type="text"
                    id='text'
                    name='text'
                    className={`form__input form__input--text ${validTextCls}`}
                    value={text}
                    onChange={onTextChange} 
                />
                <label htmlFor="userId" className='form__label form__checkbox-container'>
                    User
                </label>
                <select 
                    name="userId" 
                    id="userId"
                    value={user}
                    onChange={onUserChange}
                    className= 'form__select'
                >
                    {options}
                </select>
            </form>
        </Fragment>
    )
    return content
}

export default NewNoteForm