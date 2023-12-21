import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRefreshMutation } from './authApiSilce'
import usePersist from '../../hooks/usePercist'
import { Link, Outlet } from 'react-router-dom'
import { selectCurrentToken } from './authSlice'
import { PulseLoader } from 'react-spinners'

const PersistLogin = () => {

    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const [persist] = usePersist()

    const [trueSuccess, setTrueSuccess] = useState(false)

    const  [
        refresh,
        {
            isUninitialized,
            isLoading,
            isError,
            isSuccess,
            error
        }
    ] = useRefreshMutation()

    useEffect(() => {
        if(effectRan.current === true || process.env.NODE_ENV !== 'development'){

            const verifyRefreshToken = async () => {
                console.log("Verifying refresh token...")

                try{
                    await refresh()

                    setTrueSuccess(true)
                }catch(err){
                    console.log(err)
                }
            }

            if(!token && persist){
                verifyRefreshToken()
            }
        }
        return () => effectRan.current = true

        //eslint-disable-next-line
    },[])

    let content;
    
    if(!persist){
        //console.log("No Persist")
        content = <Outlet/>
    }else if(isLoading){
        //console.log("Loading...")
        content = <PulseLoader color={'#FFF'}/>
    }else if(isError){
        //console.log('error')
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to='/login'>Please login again</Link>
            </p>
        )
    }else if(isSuccess && trueSuccess){
        //console.log('success')
        content = <Outlet/>
    }else if(token && isUninitialized){
        //console.log("token and ununit")
        //console.log(isUninitialized)
        content = <Outlet/>
    }

  return content
}

export default PersistLogin