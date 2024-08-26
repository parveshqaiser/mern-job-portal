
import React, { useEffect } from 'react'
import { getAuthHeaders } from '../shared/authorization';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {

    let {userDetails} = getAuthHeaders();
    let navigate = useNavigate();

    // console.log("protected ", children);

    useEffect(()=>{
        if(!userDetails || userDetails.userId == null)
        {
            navigate("/login")
        } else if (userDetails.role !== "Recruiter")
        {
            navigate("/home")
        }else if (userDetails.role !== "Student")
        {
            navigate("/admin/companies");           
        }
    },[])

    return(
        <>{children}</>
    )
}

export default ProtectedRoutes;
