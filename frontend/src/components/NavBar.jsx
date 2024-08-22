
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {Menu} from "@headlessui/react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { storeUserData } from '../shared/authSlice'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket ,faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { commonEndPoints } from '../utils/api';


const NavBar = () => {

    // let user = useSelector(store=> store.auth?.userData);

    let userDetails = undefined;
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    if(window !== undefined)
    {
        userDetails = JSON.parse(localStorage.getItem("user"));
    }

    async function handleLogout()
    {
        try {
            let res = await axios.get(`${commonEndPoints}/logout`);
            if(res.data.success)
            {
                toast.success("Logging out. Please wait..");
                dispatch(storeUserData(null))
                setTimeout(()=>{
                    localStorage.removeItem("user");
                    navigate("/login");
                },2000)               
            }
        } catch (error) {
            console.log("** error while log out", error);
        }
    }

    function toggleMenu()
    {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="flex justify-between mx-auto max-w-7xl mt-3 ">
            <h2>
                <span className='text-4xl text-blue-400 font-bold'> Monster</span><span className='text-2xl text-orange-500'>.com</span>
            </h2>

            <div className="md:hidden">
                <button onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
                </button>
            </div>

            <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} md:block items-center gap-4`}>
                <ul className="flex flex-col md:flex-row gap-4">
                {
                    userDetails && userDetails.role =="Recruiter" ? (
                    <>
                        <li>
                            <Link className='hover:text-purple-600'  to="/admin/companies">Companies</Link>
                        </li>
                        <li>
                            <Link className='hover:text-purple-600' to="/admin/jobs">Jobs</Link>
                        </li>
                    </>
                    ) : userDetails?.userId &&(
                    <>
                        <li>
                            <Link className='hover:text-orange-700' to="/home">Home</Link>
                        </li>
                        <li>
                            <Link className='hover:text-orange-700' to="/browse">Browse</Link>
                        </li>
                        <li>
                            <Link className='hover:text-orange-700' to="/jobs">Jobs</Link>
                        </li>
                    </>)
                }                   
                </ul>
                {userDetails ? (
                    <div className="relative  md:mt-0">
                        <Menu as="div" className="inline-block text-left">
                            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Profile
                            </Menu.Button>
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userDetails.role === 'Student' && (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <FontAwesomeIcon className="mr-2" icon={faUser} />
                                                View Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                )}
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            onClick={handleLogout}
                                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                        >
                                            <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket} />
                                            Logout
                                        </Link>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-2 md:mt-0">
                        <Link to="/login">
                            <button className="py-2 px-3 bg-blue-300 hover:text-white rounded-md">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="py-2 px-3 bg-orange-300 hover:text-white rounded-md">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}        
            </div>
        </div>
    )
}

export default NavBar;
// hover:bg-[#5b30a6] 
