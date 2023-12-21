import React, { useEffect, useRef, useState } from 'react'
import { useLoginMutation } from './authApiSilce'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import { useDispatch } from 'react-redux'
import usePersist from '../../hooks/usePercist'
import { PulseLoader } from 'react-spinners'

const Login = () => {
  const userRef = useRef()
  const errorRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  useEffect(() => {
    userRef.current.focus()
  },[])

  useEffect(() => {
    setErrMsg('')
  },[username, password])

  const onUserChange = (e) => setUsername(e.target.value)
  const onPwdChange = (e) => setPassword(e.target.value)

  const [
    login,
    {
      isLoading
    }
  ] = useLoginMutation()

  const onHandleToggle = () => setPersist(state => !state)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try{
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dash')
    }catch(err){
      if(!err?.status){
        setErrMsg("No server response")
      }else if(err?.status === 400){
        setErrMsg('Unauthorized')
      }else{
        setErrMsg(err?.data?.message)
      }
      /* errorRef.current.focus() */
    }
  }

  const errCls = errMsg ? "errmsg" : "offscreen"

  if(isLoading){
    return <PulseLoader color={'#FFF'}/>
  }

  const content = (
    <section className='public'>
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className='login'>

        <p ref={errorRef} className={errCls}>{errMsg}</p>

        <form className='form' onSubmit={handleOnSubmit}>
          <label htmlFor="username" className='form__label'>Username : </label>
          <input 
            type="text"
            id='username'
            name='username'
            onChange={onUserChange}
            autoComplete='off'
            value={username}
            ref={userRef}
            className='form__input'
            required 
          />
          <label htmlFor="password" className='form__label'>Password : </label>
          <input 
            type="password" 
            name="password" 
            id="password"
            value={password}
            className='form__input'
            onChange={onPwdChange}
            required 
          />
          <button className='form__submit-button'>Sign In</button>
          <label htmlFor="persist" className="form__persist">
            <input 
              type="checkBox"
              id='persist'
              onChange={onHandleToggle}
              checked={persist}
              className='form__checkbox'
            />
            Trust this device
          </label>
        </form>
      </main>
      <footer>
        <Link to='/'>Back to Home</Link>
      </footer>
    </section>
  )

  return content
}

export default Login