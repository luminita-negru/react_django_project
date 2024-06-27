import {useEffect, useState} from "react"
import axiosConfig from "../interceptors/axiosConfig";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();

    useEffect(() => {
       (async () => {
         try {
           const {data} = await  
                 axiosConfig.post('/logout/',{
                 refresh_token:localStorage.getItem('refresh_token')
                 } ,{headers: {'Content-Type': 'application/json'}});
           localStorage.clear();
           navigate('/');
           } catch (e) {
             console.log('logout not working', e)
           }
         })();
    }, []);
    return (
       <div></div>
     )
}