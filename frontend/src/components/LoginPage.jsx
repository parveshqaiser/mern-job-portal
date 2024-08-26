
import React, { useEffect, useState } from 'react'
import "../../styles/loginPage.css";
import NavBar from './NavBar'
import image from "../../Images/modifyBg.jpg";

import { Link, useNavigate } from 'react-router-dom'
import { AlertMessage } from '../utils/toastify'
import axios from 'axios'
import { commonEndPoints } from '../utils/api.js'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { getLoadingMessage , storeUserData} from '../shared/authSlice.js'
import { getAuthHeaders } from '../shared/authorization.js';
import { removeDomElementsFromInput } from '../utils/domSanitize.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyedropper, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {

    // let emailExp = new RegExp("^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z.-]*[a-zA-Z]$");    
    let emailExp = new RegExp(/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/);
    const [inputValues, setInputValues] = useState({
        email : {
            value : "",
            error : "",
        },
        password : {
            value : "",
            error : "",
        },
        role : {
            value : "",
            error : "",
        }
    });

    // let loadingMessage = useSelector(store => store?.auth?.loading);
    let {userDetails} = getAuthHeaders();
    const [showPassword , setShowPassword] = useState(false);

    useEffect(()=>{
        if(userDetails?.userId)
        {
            navigate("/home")
        }
    },[])
    
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let [isDisabled , setIsDisabled] = useState(false);

    function handleTogglePassword()
    {
        setShowPassword(!showPassword)
    }

    function handleChange(e)
    {
        let {name, value} = e.target;

        let sanitize = removeDomElementsFromInput(value);
        value = sanitize;
        let newValues = {...inputValues};
        if(name == "email")
        {
            newValues[name] = {
                value : value,
                error : !value ? "Required" : (!emailExp.test(value)) ? "Invalid Email" : "",
            }
        }

        if(name == "password")
        {
            newValues[name] = {
                value : value,
                error : !value ? "Required" : (value && value.length <=7) ? "Password should be min 8 characters": "",
            }
        }

        if(name == "role")
        {
            newValues[name] = {
                value : value,
                error : "",
            }
        }
        setInputValues(newValues);
    }

    async function handleSubmit()
    {
        let {email, password,role} = inputValues;

        if(!email.value && !password.value)
        {
            setInputValues({
                ...inputValues,
                email : {
                    ...inputValues.email ,
                    error : (!emailExp.test(email.value)) ? "Invalid Email" : "Required"
                },
                password : {
                    ...inputValues.password,
                    error : "Required"
                }
            })
            return;
        }

        if(!password.value || password?.value?.length<=7)
        {
            setInputValues({
                ...inputValues, 
                password : {
                    ...inputValues.password,
                    error :!password.value ? "Required" : "Password should be min 8 characters"
            }})
            return;
        }

        if(!role.value){
            setInputValues({...inputValues, role : {...inputValues.role, error : !role.value ? "Select Role" :""}})
            return;
        }

        let data = {
            email : email.value,
            password : password.value,
            role : role.value,
        }

        try {
            // dispatch(getLoadingMessage(true));
            setIsDisabled(true)
            let res = await axios.post(`${commonEndPoints}/login`, data);
            if(res.data?.user)
            {
                dispatch(storeUserData(res.data.user));
                toast.success(res.data.message);
                localStorage.setItem("user", JSON.stringify(res.data.user))

                setTimeout(()=>{
                    setIsDisabled(false)
                    if(res?.data?.user?.role =="Student")
                    {
                        navigate("/home");
                    }else {
                        navigate("/admin/companies");
                    }
                    
                },2500)
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            setIsDisabled(false)
        }
    }

    return (
    <>
        <NavBar />
        <AlertMessage />
        <div className="min-h-screen flex flex-col md:flex-row  justify-center mt-5 mb-2 md:mx-10">
            <div className="w-full md:w-3/5 bg-cover bg-center object-cover m-2">
                <img src={image} className="rounded-lg" />
            </div>

            <div className="w-full md:w-2/6 p-3 mx-5 md:mt-10">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Welcome to Monster.com</h2>
                <p className="text-center mb-2">Please fill all the details</p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            placeholder="Tell us your Email ID"
                            onChange={handleChange}
                            type="email"
                            name="email"
                            value={inputValues.email.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                        />
                        <span className="text-red-600 text-sm">{inputValues.email.error}</span>
                    </div>
                    <div className="relative">
                        <label className="block">Password</label>
                        <input
                            placeholder="Minimum 8 characters"
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={inputValues.password.value}
                            autoComplete="current-password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                        />
                        <FontAwesomeIcon 
                          onClick={handleTogglePassword}
                            icon={!showPassword ? faEyeSlash : faEye} 
                            className={`absolute myClass right-3 text-gray-500 cursor-pointer`}
                        />
                        <span className="text-red-600 text-sm">{inputValues.password.error}</span>
                    </div>
                    <div>
                        <p className="block mb-2">Select your Registered Role</p>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="role"
                                value="Student"
                                className="mr-2"
                                onChange={handleChange}
                            />
                            <label className="mr-4">Job Seeker</label>
                            <input
                                type="radio"
                                name="role"
                                value="Recruiter"
                                className="mr-2"
                                onChange={handleChange}
                            />
                            <label>Recruiter</label>
                        </div>
                        <span className="text-red-600 text-sm">{inputValues.role.error}</span>
                    </div>
                    <div className="text-center">
                        {isDisabled ? (
                            <button
                                disabled={isDisabled}
                                className="bg-blue-500 w-full text-white px-6 py-2 rounded-md cursor-not-allowed"
                            >
                                Please Wait...
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 hover:bg-purple-600 w-full text-white px-6 py-2 rounded-md"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                    <div className="text-center">
                        <span>Haven't Registered Yet?</span>
                        <Link to="/signup">
                            <span className="text-blue-500 font-semibold"> Register Here </span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>       
    </>
    )
}

export default LoginPage
