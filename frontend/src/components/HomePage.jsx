import React, { useEffect } from 'react'
import NavBar from './NavBar'
import MainSection from './MainSection'
import LatestJobOpenings from './LatestJobOpenings'
import Footer from './Footer'
import useGetAllJobs from '../shared/useGetAllJobs'
import { useNavigate } from 'react-router-dom'
import { getAuthHeaders } from '../shared/authorization'
import { AlertMessage } from '../utils/toastify'

const HomePage = () => {

    let navigate = useNavigate();
    let {userDetails} = getAuthHeaders();
    useGetAllJobs();

    useEffect(()=>{
        if(userDetails && userDetails.role && userDetails.role=="Recruiter")
        {
            navigate("/admin/companies");
        }else if(!userDetails || userDetails?.userId == null)
        {
            navigate("/login")
        }
    },[])
    return (
        <div>
            <AlertMessage />
            <NavBar />
            <MainSection />
            <LatestJobOpenings />
            <Footer />
        </div>
    )
}

export default HomePage
