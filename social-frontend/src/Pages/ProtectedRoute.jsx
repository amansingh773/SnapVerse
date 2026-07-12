import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { addUserData } from '../Utils/UserSlice'

const ProtectedRoute = () => {

    const userData = useSelector(store => store.user)
    const nav = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(userData.username)
        {
            return
        }
        async function getUserData() {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/auth/get-user-data", {withCredentials : true})
                dispatch(addUserData(res.data.data))
 
            } catch (error) {
                nav("/login")
            }

        }
        getUserData()
    }, [])

    useEffect(() => {
  if (!userData.username) return;

  if (userData.isCompletedProfile === false) {
    nav("/complete-profile");
  }
}, [userData, nav]);

  if(!userData.username)
  {
    return <h1>Loading...</h1>
  }
  
//   if(!userData.isCompletedProfile)
//   {
//     nav("/complete-profile")
//   }

  return <Outlet />

}

export default ProtectedRoute