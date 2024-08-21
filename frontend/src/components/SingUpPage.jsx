
// import "../signUpPage.css";
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import image from "../../Images/modifyBg.jpg"
import { Link, useNavigate } from 'react-router-dom'
import { commonEndPoints } from '../utils/api.js'
import axios from "axios";
import {toast}from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AlertMessage } from '../utils/toastify.js'
import { removeDomElementsFromInput } from '../utils/domSanitize.js'
import { getAuthHeaders } from '../shared/authorization.js'


const SingUpPage = () => {

    let {userDetails} = getAuthHeaders();
    let navigate = useNavigate();
    const [isDisabled , setIsDisabled] = useState(false);

    useEffect(()=>{
        if(userDetails?.userId)
        {
            navigate("/home")
        }
    },[])

    const [formValues, setFormValues] = useState({
        fullName : {
            value : "",
            error : "",
        }, 
        email : {
            value : "",
            error : "",
        },
        password: {
            value : "",
            error : "",
        },
        mobile: {
            value : "",
            error : "",
        },
        role: {
            value : "",
            error : "",
        },
        file : ""
    });


    function handleChange(e)
    {
        let {name, value} = e.target;
        let sanitize = removeDomElementsFromInput(value);
        value = sanitize;
        let emailExp = new RegExp("^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z.-]*[a-zA-Z]$");    

        let newValues = {...formValues};
      
        if(name == "fullName")
        {
            value = value.charAt(0).toUpperCase() + value.slice(1);
            newValues[name] = {
                value : value,
                error : !value ? "Required" :"",
            }
        }

        if (name == "email")
        {
            newValues[name] = {
                value : value,
                error : !value ? "Required" : (!emailExp.test(value)) ? "Invalid Email" : "",
            }
        }

        if(name == "mobile")
        {
            newValues[name] = {
                value : value && value >= 6 ? parseInt(value) || "" :"",
                error : !value ? "Required" : (value >=0 && value <=5) ? "Mobile Number must start between 6-9 & must be 10 digits":"",
            }
        }

        if(name == "password")
        {
            newValues[name] = {
                value : value,
                error : !value ? "Required" : (value.length <=8) ? "Password should be min 8 characters": "",
            }
        }

        if(name == "role")
        {
            newValues[name] = {
                value : value,
                error : "",
            }
        }

        setFormValues(newValues);
    }

    function handleFileChange(e)
    {
       let val = e.target.files[0];
       setFormValues({...formValues, file : val.name});
    }

    async function handleSubmit()
    {
        console.log(formValues);
        let {fullName, email,mobile,password,role,file} = formValues;
        let emailExp = new RegExp("^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z.-]*[a-zA-Z]$");
        let phoneExp = new RegExp("^[6-9]\\d{9}$");   


        if(!fullName.value){
            setFormValues({...formValues, fullName : {...formValues.fullName , error : "Required"}})
            return;
        }

        if(!email.value){
            setFormValues({
                ...formValues,
                email : {
                    ...formValues.email,
                    error : (!emailExp.test(email.value)) ? "Invalid Email" : "Required"
                }
            })
            return;
        }

        if (!mobile.value || !phoneExp.test(mobile.value))
        {
            setFormValues({
                ...formValues,
                mobile : {
                    ...formValues.mobile,
                    error :!mobile.value ? "Required" :"Invalid Number",
                }
            });
            return;
        }

        if(!password.value || password.value.length<=5){
            setFormValues({
                ...formValues, 
                password : {
                    ...formValues.password,
                    error :!password.value ? "Required" : "Password should be min 8 characters"
            }})
        }
        if(!role.value){
            setFormValues({...formValues, role : {...formValues.role, error : !role.value ? "Select Role" :""}})
            return;
        }

        let data = {
            fullName : fullName.value,
            email : email.value,
            mobile : mobile.value.toString(),
            fullName : fullName.value,
            password : password.value,
            role : role.value,
        }

        try {
            setIsDisabled(true);
            let res = await axios.post(`${commonEndPoints}/register`,data);
            if(res.data?.message)
            {
                toast.success(res.data?.message);
                setTimeout(()=>{
                    navigate("/login");
                    setIsDisabled(false);
                },2500)   
            }

        } catch (error) {
            console.log("error ", error.response)
            toast.error(error.response?.data?.message);
            setIsDisabled(false);
        }
    }
    
    return (
        <>
        <AlertMessage />
        <NavBar />
        <div className="min-h-screen flex flex-col md:flex-row justify-center mt-5 mb-2 md:mx-10">
            <div className="w-full md:w-3/5 bg-cover object-cover bg-center rounded-lg m-2">
            {/* style={{backgroundImage : `url(${image})`}} */}
                <img src={image} className='rounded-lg' />
            </div>
            
            <div className="w-full md:w-2/6 p-3 mx-5 md:mt-10">
                <h2 className="text-2xl font-bold mb-2 text-center">User Registration Form</h2>
                <p className="text-center mb-2">Please fill all the details</p>
                <form className="space-y-4" onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <label className="block">Full Name</label>
                        <input 
                            placeholder = "What's your Name ?"
                            onChange={handleChange}
                            type="text" 
                            autoComplete='off'
                            name='fullName'
                            value={formValues.fullName.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                        />
                        <span className='text-red-600 text-sm'>{formValues.fullName.error}</span>
                    </div>
                    <div>
                        <label className="block">Email</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            name='email'
                            value={formValues.email.value}
                            autoComplete='off'
                            placeholder='Tell us your Email ID'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                        />
                        <span className='text-red-600 text-sm'>{formValues.email.error}</span>
                    </div>
                    <div>
                        <label className="block">Contact Number</label>
                        <input 
                            onChange={handleChange}
                            maxLength={10}
                            type="text" 
                            name='mobile'
                            value={formValues.mobile.value}
                            placeholder='+9100000000'
                            autoComplete='off'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 focus:ring-2"
                        />
                        <span className='text-red-600 text-sm'>{formValues.mobile.error}</span>
                    </div>
                    <div>
                        <label className="block">Password</label>
                        <input 
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            type='password'
                            name="password"
                            value={formValues.password.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        <span className='text-red-600 text-sm'>{formValues.password.error}</span>
                    </div>
                    <div>
                        <p className="block mb-2">Are You a Recruiter or Job Seeker?</p>
                        <div className="flex items-center">
                            <input 
                                type="radio"
                                name="role"
                                value="Student"
                                onChange={handleChange} 
                                className="mr-2"
                            />
                            <label className="mr-4">Job Seeker</label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="Recruiter" 
                                onChange={handleChange} 
                                className="mr-2"
                            />
                            <label>Recruiter</label>
                        </div>
                        <span className='text-red-600 text-sm'>{formValues.role.error}</span>
                    </div>
                    {/* <div>
                        <label className="block">Please Upload File</label>
                        <input 
                            accept='image/' 
                            type="file" 
                            className="w-full px-3 py-2"
                            onChange={handleFileChange}
                        />
                    </div> */}
                    <div className="text-center">
                    {
                        isDisabled ? 
                        <button 
                            disabled={isDisabled} 
                            className="bg-blue-500 w-full text-white px-6 py-2 rounded-md cursor-not-allowed">
                            Please Wait...
                        </button> :
                        <button 
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-purple-600 w-full text-white px-6 py-2 rounded-md"
                        >Submit</button>
                    }
                       
                    </div>
                    <div className='text-center'> 
                        <span>Already Registered ? </span>
                        <Link to='/login'><span className='text-blue-500 font-semibold'>Login Here </span></Link>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}

export default SingUpPage;

  // let headers = {
        //     Accept: 'application/json',
        //     "Content-Type": 'application/x-www-form-urlencoded',
        // };

        // let formData = new FormData();
        // formData.append("key", value)

