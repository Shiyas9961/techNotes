import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteUserMutation, useUpdateUserMutation } from './usersApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'

const REGEX_USER = /^[A-z]{3,20}$/
const REGEX_PWD = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({user}) => {

    const [
        updateUser,
        {
           isError,
           isLoading,
           isSuccess,
           error 
        }
     ] = useUpdateUserMutation()

    const [
        deleteUser,
        {
            isError : isDelError,
            isSuccess : delSuccess,
            error : delError
        }
     ] = useDeleteUserMutation()


    const [username, setUsername] = useState(user.username)
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [validUser, setValidUser] = useState(false)
    const [validPwd, setValidPwd] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        setValidUser(REGEX_USER.test(username))
    },[ username ])

    useEffect(() => {
        setValidPwd(REGEX_PWD.test(password))
    },[ password ])

    useEffect(()=>{
        if(isSuccess || delSuccess){
            setUsername('')
            setPassword('')
            setRoles([])
            setActive(false)
            navigate('/dash/users')
        }
    },[ isSuccess, delSuccess, navigate ])


    const onUserChanged = (e) => setUsername(e.target.value)
    const onPwdChanged = (e) => setPassword(e.target.value)

    const onRolesChanged = (e) => {
        const values = Array.from(e.target.selectedOptions,(option) => option.value)
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async () => {
        if(password){
            await updateUser({ id : user.id, username, password, roles, active })
        }else{
            await updateUser({ id : user.id, username, roles, active })
        }
    }

    const onDeleteClicked = async () => {
        await deleteUser({ id : user.id })
    }

    let canSave;
    if(password){
        canSave = [ roles?.length, validUser, validPwd].every(Boolean) && !isLoading
    }else{
        canSave = [ roles?.length, validUser].every(Boolean) && !isLoading
    }


    const errCls = ( isError || isDelError ) ? "errmsg" : "offscreen"
    const validUserCls = !validUser ? 'form__input--incomplete' : ''
    const validPwdCls = !validPwd ? 'form__input--incomplete' : ''
    const validRolesCls = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    
    const errContent = ( error?.data?.message || delError?.data?.message ) || ''

    const options = Object.keys(ROLES).map(role => {
        return (
            <option key={role} value={role}>{role}</option>
        )
    })

    const content = (
        <Fragment>
            <p className={errCls}>{errContent}</p>

            <form className='form' onSubmit={(e)=>e.preventDefault()}>
                <div className='form__title-row'>
                    <h2>Edit User</h2>
                    <div className='form__action-button'>
                        <button 
                            className='icon-button' 
                            title='Save' 
                            disabled={!canSave}
                            onClick={onSaveUserClicked}
                        >
                            <FontAwesomeIcon icon={faSave}/>
                        </button>
                        <button 
                            className='icon-button' 
                            title='Delete'
                            onClick={onDeleteClicked} 
                        >
                            <FontAwesomeIcon icon={faTrashCan}/>
                        </button>
                    </div>
                </div>
                <label htmlFor="username" className='form__label'>
                    Username : <span className='nowrap'>[30-20 letter]</span>
                </label>
                <input 
                    type="text"
                    id='username'
                    className={`form__input ${validUserCls}`}
                    onChange={onUserChanged}
                    autoComplete='off'
                    value={username}
                    name='username'
                />
                <label htmlFor="password" className='form__label'>
                    Password : <span className='wrap'>[4-12 chars incl. !@#$%]</span>
                </label>
                <input 
                    type="password" 
                    name="password" 
                    id="password"
                    className={`form__input ${validPwdCls}`}
                    onChange={onPwdChanged}
                    value={password} 
                />
                <label htmlFor="user-active" className='form__label form__checkbox-container'>
                    ACTIVE : 
                    <input 
                        type="checkbox"
                        id='user-active'
                        className='form__checkbox'
                        name='user-active'
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>
                <label htmlFor="roles">
                    ASSIGNED ROLES : 
                </label>
                <select 
                    name="roles" 
                    id="roles"
                    value={roles}
                    className={`form__select ${validRolesCls}`}
                    onChange={onRolesChanged}
                    size="3"
                    multiple={true}
                >
                    {options}
                </select>
            </form>
        </Fragment>
    )

  return content
}

export default EditUserForm