import React from 'react'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashFooter = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { username, status } = useAuth()


    let goHomeButton = null

    const goHomeClicked = () => {
        navigate('/dash')
    }
    if(pathname !== '/dash'){
        goHomeButton = (
            <button className='dash-footer__button icon-button' title='home' onClick={goHomeClicked}><FontAwesomeIcon icon={faHome}/></button>
        )
    }
  return (
    <footer className='dash-footer'>
        {goHomeButton}
        <p>Current User : {username}</p>
        <p>Status : {status}</p>
    </footer>
  )
}

export default DashFooter