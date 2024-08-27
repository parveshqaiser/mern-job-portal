

import React ,{useEffect, useState } from 'react'
import NavBar from './NavBar'
import uploadPic  from "../../Images/uploadPic.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCalendar, faEnvelopeOpenText, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faPhoneSquare , faLocationDot , faBriefcase ,faUserPen} from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import {commonEndPoints} from '../utils/api';
import { toast } from 'react-toastify'

import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { AlertMessage } from '../utils/toastify';
import useGetApplications from '../shared/useGetApplications';
import ProfileTable from './ProfileTable';
import { getAuthHeaders } from '../shared/authorization';
import { useNavigate } from 'react-router-dom';

// note , flex items-start [here items start no work] , flex flex-col also not work , flex items-center
const ProfilePage = () => {

    let {isLoading} = useGetApplications(); // hook
    let {headerInfo, userDetails} = getAuthHeaders(); // token

    const [show,setShow] = useState(false);
    const [notify ,setNotify] = useState(false)
    const handleClose = () => {setShow(false) , setNotify(false)};
    let navigate = useNavigate();

    const [incomingData, setIncomingData] = useState(null);
    const [isDisabled , setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        fullName : "", 
        email : "", 
        mobile :"", 
        file :"", 
        profilePicture : "",
        bio : "", 
        skills: "",
        address : "",
        totalExp : "",
        currentCompany : "",
    });

    useEffect(()=>{
        if(userDetails?.role == "Recruiter")
        {
            navigate("/admin/companies");
        }
    },[])

    useEffect(()=>{
        setNotify(true);
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
                setIncomingData(res?.data?.currentUser) 
            }else {
                setIncomingData({}) 
            }
        } catch (error) {
            console.log("error fetching data ", error)
        }
        setLoading(false)
    }

    function handleOpenModal()
    {
        setFormValues({
            fullName : incomingData.fullName || "",
            profilePicture : incomingData?.profile?.profilePicture || "",
            email : incomingData.email || "",
            mobile : incomingData.mobile || "",
            skills : incomingData?.profile?.skills?.map(val=> val) || "",
            bio : incomingData?.profile?.bio || "",
            address : incomingData?.profile?.address || "",
            totalExp : incomingData?.profile?.totalExp || "",
            currentCompany : incomingData?.profile?.currentCompany || "",
            file : "",
        });
        setShow(true);
    }

    function handleFileChange(e)
    {
       let val = e.target.files[0];
       let name = e.target.name;

       if(name == "file")
       {
        setFormValues({...formValues, file : val});
       }

       if(name == "profilePicture")
       {
        setFormValues({...formValues, profilePicture : val})
       }       
    }

    function handleChange(e)
    {
        let {name,value} = e.target;

        if(name == "mobile")
        {
            value = value && value >= 6 ? parseInt(value) || "" : "";
            setFormValues({...formValues , [name] : value});
        }

        setFormValues({...formValues, [name] : value})
    }

    async function handleSubmit()
    {
        const formData = new FormData();
        if(formValues.file=="")
        {
            toast.warning("Please Upload Your Resume");
            return;
        }
        if(formValues.profilePicture=="")
        {
            toast.warning("Please Update Profile Pic");
            return;
        }   

        formData.append("fullName", formValues.fullName || "");
        formData.append("email", formValues.email || "");
        formData.append("mobile", formValues.mobile || "");
        formData.append("bio", formValues.bio || "");
        formData.append("skills", formValues.skills || "");
        formData.append("address", formValues.address || "");
        formData.append("totalExp", formValues.totalExp || "");
        formData.append("currentCompany" , formValues.currentCompany || "");
        formData.append("file", formValues.file || "");
        formData.append("file", formValues.profilePicture || "");

        // formData.forEach((key,val)=>{
        //     console.log("k ", key , ": ", val);
        // });

        try {
            setIsDisabled(true);
            let res = await axios.post(`${commonEndPoints}/update/profile`, formData, {headers : headerInfo});

            if(res.data.success)
            {
                toast.success(res.data.message);
                setTimeout(()=>{
                    setShow(false);
                    getData();
                    setIsDisabled(false);
                },2500)
            }
        } catch (error) {
            console.log("err", error);
            toast.error(error?.response?.data?.message);
            setIsDisabled(false);
        }
    }

    return (
    <>

    <Modal  onHide={handleClose} size="md">
        <Modal.Body>
            <p className='font-semibold text-justify'>
                Keep your profile active!. 
                Regularly updated profiles have a much higher chance of catching employers' attention. 
                A 100% complete profile is your best way to stand out from the crowd!
            </p>
        </Modal.Body>
        <Modal.Footer>
            <button onClick={handleClose}>Close</button>
        </Modal.Footer>
    </Modal>

    <NavBar />
    <AlertMessage />
    {
        loading ? <div className='text-center font-semibold'>Loading...</div> :
        <div className="max-w-6xl mx-auto mt-5 mb-2 p-3 border rounded-lg shadow-lg bg-white">
            <div className="flex flex-col sm:flex-row items-center">
                <div className="w-full sm:w-1/4 flex justify-center sm:justify-center relative mb-4 sm:mb-0">

                    <img src={incomingData?.profile?.profilePicture || uploadPic}
                        className="w-36 h-36 rounded-full border-2 border-gray-200" 
                        alt="Profile Pic" 
                    />
                    <span className={`absolute ${incomingData?.profile && Object.keys(incomingData.profile).length>=7 ? "bg-green-500" : "bg-yellow-500"} text-white text-xs px-2 py-1 rounded-full`} >
                    {incomingData?.profile && Object.keys(incomingData.profile).length>=7 ? "90%" : "50%"}
                    </span>
                </div>
                <div className="w-full sm:w-3/4 sm:pl-6">
                    {/* first */}
                    <div className="my-3 ">
                        <div className='flex justify-between'>
                            <h2 className="text-2xl font-bold text-gray-800">{incomingData?.fullName || "NA"}</h2>
                            <FontAwesomeIcon icon={faUserPen} 
                                title="Edit Profile" 
                                onClick={handleOpenModal} 
                                className="cursor-pointer mr-2 text-green-600 w-6 h-6 hover:text-green-800 transition duration-300" 
                            />
                        </div>
                        <p className="text-lg text-gray-600">
                            {incomingData?.profile?.bio || "NA"} {incomingData?.profile?.currentCompany && 
                            <span className="font-semibold text-blue-600">at {incomingData?.profile?.currentCompany}</span>}
                        </p>
                    </div>

                    <hr className="my-2" />

                    {/* second */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="">
                            <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2 text-blue-500" />
                            <span>{incomingData?.email || "NA"}</span>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faPhoneSquare} className="mr-2 text-green-500" />
                            <span>+91- {incomingData?.mobile || "NA"}</span>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-red-500" />
                            <span>{incomingData?.profile?.address || "NA"}</span>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-yellow-500" />
                            <span>{incomingData?.profile?.totalExp == "0" ? "Fresher" : incomingData?.profile?.totalExp}</span>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-gray-500" />
                            <span>Resume: </span>&nbsp;
                            <a target="_blank" 
                                // download={incomingData?.profile?.resumeLink || "NA"} 
                                href={incomingData && (incomingData?.profile?.resumeLink)} 
                                className="hover:underline hover:text-blue-600 cursor-pointer"
                            >
                                {incomingData?.profile?.resumeName || "Please Upload Resume"}
                            </a>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2 text-purple-500" />
                            <span>Skills: {(incomingData?.profile?.skills.length) ? incomingData?.profile?.skills : "NA"}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    }

    <div className='max-w-6xl mx-auto mt-2'>
        <h1 className='font-semibold text-orange-500 text-center'>Your Recent Applied Jobs</h1>
        <ProfileTable isLoading={isLoading}/>
    </div>

{/* sm:max-w-[425px] */}
        <Modal show={show} onHide={handleClose} size="lg" className=''>
            <Modal.Header closeButton className={""}>
                <Modal.Title>
                    Update Profile
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="mx-3">
            <form className="space-y-4" onSubmit={(e)=> e.preventDefault()}>
                <div className=''>
                    <label className="block">Full Name <span className='text-red-600 font-bold'> *</span></label>                        
                    <input 
                        placeholder = "Tell Us your New Name ?"
                        onChange={handleChange}
                        type="text" 
                        value={formValues.fullName}
                        autoComplete='off'
                        name='fullName'
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                    />
                </div>
                <div>
                    <label className="block">Email <span className='text-red-600 font-bold'> *</span></label>
                    <input 
                        onChange={handleChange}
                        type="text" 
                        name='email'
                        value={formValues.email}
                        autoComplete='off'
                        placeholder='Tell us your new Email Address'
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                    />
                </div>
                <div>
                    <label className="block">Contact Number <span className='text-red-600 font-bold'> *</span></label>
                    <input 
                        onChange={handleChange}
                        maxLength={10}
                        type="text" 
                        value={formValues.mobile}
                        name='mobile'
                        placeholder='+9100000000'
                        autoComplete='off'
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                    />
                </div>
                <div>
                    <label className="block">Your Bio <span className='text-red-600 font-bold'> *</span></label>
                    <textarea  
                        onChange={handleChange} rows="2" cols="5" 
                        name='bio'
                        value={formValues.bio}
                        placeholder='A brief bio about yourself'
                        className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2'
                    >
                    </textarea>
                </div>
                <div>
                    <label className="block">Your Skills <span className='text-red-600 font-bold'> *</span></label>
                    <input 
                        onChange={handleChange}
                        type="text" 
                        name='skills'
                        placeholder='Write your skills'
                        autoComplete='off'
                        value={formValues.skills}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"/>
                </div>
                <div>
                    <label className="block">Your Current or Permanent Location <span className='text-red-600 font-bold'> *</span></label>
                    <input 
                        onChange={handleChange}
                        type="text" 
                        name='address'
                        placeholder='Enter Your Location'
                        autoComplete='off'
                        value={formValues.address}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"/>
                </div>
                <div>
                    <label className="block">Your Current Company 
                        <span className="text-gray-500 text-sm"> (Leave empty if you are not working)</span>
                    </label>
                    <input 
                        onChange={handleChange}
                        type="text" 
                        name='currentCompany'
                        placeholder='Currently Working Somewhere ?'
                        autoComplete='off'
                        title="Leave empty if you are a fresher or currently not working"
                        value={formValues.currentCompany}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"/>
                </div>
                <div>
                    <label className="block">Your Total Work Experience in (years) ? <span className='text-red-600 font-bold'> *</span></label>
                    <input 
                        onChange={handleChange}
                        type="text" 
                        name='totalExp'
                        placeholder='Work Experience in (years)'
                        autoComplete='off'
                        value={formValues.totalExp}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"/>
                </div>
                <div className='flex flex-col sm:flex-row justify-between'>   
                    <div>
                        <label className="">Please Upload Updated Resume <span className='text-red-600 font-bold'> *</span></label>
                        <input 
                            accept="application/pdf"
                            type="file" 
                            name='file'
                            className="w-full px-2 py-2"
                            onChange={handleFileChange}
                        />
                    </div>                     
                    <div>
                        <label className="">Please Upload Profile Pic <span className='text-red-600 font-bold'> *</span></label>
                        <input 
                            accept="image/png,image/jpeg"
                            type="file" 
                            name='profilePicture'
                            className="w-full px-2 py-2"
                            onChange={handleFileChange}
                        />
                    </div>                       
                </div>
                <div className="text-center">
                {
                    isDisabled ? 
                    <button 
                        disabled={isDisabled}
                        className="bg-blue-500 cursor-not-allowed w-full text-white px-6 py-2 rounded-md"
                    >
                        Updating Your Profile
                    </button> :
                        <button 
                            disabled={isDisabled}
                            onClick={handleSubmit}
                            className="bg-blue-500  w-full text-white px-6 py-2 rounded-md"
                    >
                        Update
                    </button> 
                }
                </div>
            </form>
            </Modal.Body>
        </Modal>
    </>
    )
}

export default ProfilePage;

