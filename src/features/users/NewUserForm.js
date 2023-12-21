import React, { Fragment, useEffect, useState } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [
    addNewUser,
    {
      isError,
      isSuccess,
      isLoading,
      error
    }
  ] = useAddNewUserMutation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState(["Employee"])
  const [validUser, setValidUser] = useState(false)
  const [validPwd, setValidPwd] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setValidUser(USER_REGEX.test(username))
  },[username])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password))
  },[password])

  useEffect(() => {
    if(isSuccess){
      setPassword('')
      setUsername('')
      setRoles([])
      navigate('/dash/users')
    }
  },[isSuccess, navigate])

  const onUsernameChanged = (e) => ( setUsername(e.target.value) )
  const onPasswordChanged = (e) => ( setPassword(e.target.value) )

  const onRolesChanged = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value)
    setRoles(values)
  }

  const canSave = [roles?.length, validUser, validPwd].every(Boolean) && !isLoading

  const onSaveNewUser = (e) => {
    e.preventDefault()

    if(canSave) {
      addNewUser({ username, password, roles })
    }
  }

  const options = Object.keys(ROLES).map(role => {
    return (
      <option key={role} value={role}>{role}</option>
    )
  })

  const errCls = isError ? "errmsg" : "offscreen"
  const validUserCls = !validUser ? 'form__input--incomplete' : ''
  const validPwdCls = !validPwd ? 'form__input--incomplete' : ''
  const validRolesCls = !Boolean(roles.length) ? 'form__input--incomplete' : ''

  const content = (
    <Fragment>
      <p className={errCls}>{error?.data?.message}</p>

      <form onSubmit={onSaveNewUser} className='form'>
        <div className="form__title-row">
          <h2>Add New User</h2>
          <div className='form__action-buttons'>
            <button className='icon-button' title="save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave}/>
            </button>
          </div>
        </div>
        <label htmlFor="username" className='form__label'>
          Username : <span className='nowrap'>[30-20 letter]</span>
        </label>
        <input 
          className ={`form__input ${validUserCls}`}
          type="text" 
          id='username'
          onChange={onUsernameChanged} 
          value={username} 
          autoComplete='off'
          name='username'
        />
        <label htmlFor="password" className='form__label'>
          Password : <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdCls}`} 
          type="password"
          onChange={onPasswordChanged}
          value={password}
          name='password'
          id='password'
        />
        <label className='form__label' htmlFor="roles">ASSIGNED ROLES : </label>
        <select 
          name = "roles" 
          id = "roles"
          className = {`form__select ${validRolesCls}`}
          onChange = {onRolesChanged}
          multiple = {true}
          size = "3"
          value={roles} 
        >
          {options}
        </select>
      </form>
    </Fragment>
  )

  return content
}

export default NewUserForm