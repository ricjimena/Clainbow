import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getLocalStorage } from '../../../server/utils/localStorageUtils';
import {jwtDecode} from 'jwt-decode'
import axios from 'axios';

export const ClainbowContext = createContext();

export const ClainbowProvider = ({children}) => {
  const [user, setUser] = useState()
  const [token, setToken] = useState()
  const [showNavBar, setShowNavBar] = useState(true)
  const [likes, setLikes] = useState([]);
  const [showCartFill, setShowCartFill] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    let tokenLocal = getLocalStorage("token")
    
    if (tokenLocal){
    
      // con el id que devuelve el token, ya puedo saber que usuario se dejó la app abierta
      const {id} = jwtDecode(tokenLocal).user  

      axios
        .get(`http://localhost:3000/users/getOneUser/${id}`)
        .then((res)=>{
          setUser(res.data.user);
          setLikes(res.data.favourites);
          setToken(tokenLocal);
          
          if (res.data.user_type === 1 ){
            navigate('/settings');
          }           
        })
        .catch((err)=>{
          console.log(err)
        })
    }
  },[])


  return (
    <ClainbowContext.Provider value={{user, setUser, token, setToken, showNavBar, setShowNavBar, likes, setLikes, showCartFill, setShowCartFill}}>
      {children}
    </ClainbowContext.Provider>
  )
}
