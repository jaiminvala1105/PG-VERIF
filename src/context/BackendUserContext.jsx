import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser } from './AuthUserContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { __DB } from '../backend/firebaseConfig'

export let FetchDataFromBackend=createContext()

const BackendUserContext = ({children}) => {
  let {authusers}=useContext(AuthUser)
  let [userData,setUserData]=useState(null)

  let uid=authusers?.uid

  let fetchuserDetails=async ()=>{
    let userDataRef=doc(__DB,'users',uid)
    onSnapshot(userDataRef,(userInfo)=>{
      if(userInfo?.exists()){
        setUserData(userInfo?.data())
      }else{
        console.log('user data not found')
      }
    })
  }

  useEffect(()=>{
    if(!uid){return;}
    fetchuserDetails()
  },[uid])

  return (
    <FetchDataFromBackend.Provider value={{userData}}>
      {children}
    </FetchDataFromBackend.Provider>
  )
}

export default BackendUserContext