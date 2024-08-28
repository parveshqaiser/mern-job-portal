import { useState } from "react";


const useFormValues = ()=>{

    const [formValues, setFormValues] = useState({
        fullName : {
            value :"",
            error : "",
        }, 
        email : {
            value :"",
            error : "",
        }, 
        mobile :{
            value :"",
            error : "",
        }, 
        bio : {
            value :"",
            error : "",
        }, 
        skills: {
            value :"",
            error : "",
        },
        address : {
            value :"",
            error : "",
        },
        totalExp : {
            value :"",
            error : "",
        },
        currentCompany : {
            value :"",
            error : "",
        },
        file : {
            value :"",
            error : "",
        }, 
        profilePicture : {
            value :"",
            error : "",
        },
    });

    return [formValues, setFormValues]
};

export default useFormValues;