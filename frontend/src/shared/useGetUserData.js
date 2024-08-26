

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { storeUserData } from './authSlice';
import { getAuthHeaders } from './authorization';
import axios from 'axios';
import { commonEndPoints } from '../utils/api';

const useGetUserData = () => {
 
    const [loading, setLoading] = useState(false);
    let {headerInfo, userDetails} = getAuthHeaders();
    let dispatch = useDispatch();

    useEffect(()=>{
        getData();
    },[])

    async function getData()
    {
        setLoading(true)
        try {
            let res = await axios.get(`${commonEndPoints}/getUserData`, {headers : headerInfo});
            // console.log("getData ", res.data.currentUser)
            if(res?.data?.currentUser)
            {
                dispatch(storeUserData(res?.data?.currentUser))
            }else {
                dispatch(storeUserData(""))
            }
        } catch (error) {
            console.log("error fetching data ", error)
        }
        setLoading(false)
    }

    return {loading}
}

export default useGetUserData;
