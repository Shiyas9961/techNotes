import React, { Fragment, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFileCirclePlus, faFilePen, faUserGear, faUserPlus } from '@fortawesome/free-solid-svg-icons' 
import { useSendLogoutMutation } from '../features/auth/authApiSilce'
import useAuth from '../hooks/useAuth'
import { PulseLoader } from 'react-spinners'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

function DashHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isAdmin, isManager } = useAuth()

  const [
    sendLogOut,{
      isSuccess,
      isError,
      isLoading,
      error
    }
  ] = useSendLogoutMutation()

  useEffect(() => {
    if(isSuccess){
      navigate('/')
    }
  },[isSuccess, navigate])

  const onNewUserClicked = () => navigate('/dash/users/new')
  const onNewNotesClicked = () => navigate('/dash/notes/new')
  const onUsersClicked = () => navigate('/dash/users')
  const onNotesClicked = () => navigate('/dash/notes')

  let dashCls = null
  if(!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)){
    dashCls = 'dash-header__container--small'
  }

  let newNoteButton = null
  if(NOTES_REGEX.test(pathname)){
    newNoteButton = (
      <button
        className='icon-button'
        onClick={onNewNotesClicked}
        title='New Note'
      >
        <FontAwesomeIcon icon={faFileCirclePlus}/>
      </button>
    )
  }

  let newUserButton = null
  if(USERS_REGEX.test(pathname)){
    newNoteButton = (
      <button
        className='icon-button'
        onClick={onNewUserClicked}
        title='New User' 
      >
        <FontAwesomeIcon icon={faUserPlus}/>
      </button>
    )
  }

  let usersButton = null
  if(isAdmin || isManager){
    if(!USERS_REGEX.test(pathname) && pathname.includes('/dash')){
      usersButton = (
        <button 
          className='icon-button'
          title='Edit User'
          onClick={onUsersClicked}
        >
          <FontAwesomeIcon icon={faUserGear}/>
        </button>
      )
    }
  }

  let notesButton = null
  if(!NOTES_REGEX.test(pathname) && pathname.includes('/dash')){
      notesButton = (
        <button 
          className='icon-button'
          onClick={onNotesClicked}
          title='Edit Note'
        >
          <FontAwesomeIcon icon={faFilePen}/>
        </button>
      )
    }

  const logoutButton = (
    <button 
      className='icon-button'
      title='Logout'
      onClick={sendLogOut}
    >
      <FontAwesomeIcon icon={faRightFromBracket}/>
    </button>
  )

  const errCls = isError ? "errmsg" : "offscreen"

  let buttonContent;
  if(isLoading){
    buttonContent = (
      <PulseLoader color={'#FFF'}/>
    )
  }else{
    buttonContent = (
      <Fragment>
        {newUserButton}
        {newNoteButton}
        {notesButton}
        {usersButton}
        {logoutButton}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <p className={errCls}>{error?.data?.message}</p>
      <header className='dash-header'>
          <div className={`dash-header__container ${dashCls}`}>
              <Link to="/dash">
                  <h1 className='dash-header__title'>TechNotes</h1>
              </Link>
              <nav className='dash-header__nav'>
                  {buttonContent}
              </nav>
          </div>
      </header>
    </Fragment>
  )
}

export default DashHeader