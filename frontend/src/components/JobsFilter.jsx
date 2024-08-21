import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { storeSearchQuery } from '../shared/jobsSlice';

const JobsFilter = () => {

    let list = [
        {
            "number" : "1",
            "domain" :"Location",
            "values" : ["Pune", "Hyderabad", "Delhi", "Chennai", "Bengluru", "Mumbai", "Kochi"]
        },
        {
            "number" : "2",
            "domain" :"Title",
            "values" : ["React Developer", "MERN Developer", "Next JS Dev", "Vue JS", "JavaScript" , "Java" ,"HR", "Support"]
        },
        {
            "number" : "3",
            "domain" :"By Salary Range",
            "values" : ["2-4 LPA", "4-6 LPA ", "6-7 LPA", "7-8 LPA" , "8-10 LPA" , "10-13 LPA"]
        }
    ];

    const [inputValue, setInputValue] = useState("");
    let dispatch = useDispatch();

    function handleChange(e)
    {
        let value = e.target.value;
        if(e.target.checked);
        {
            if(value.includes("LPA"))
            {
                value = value.replace("LPA","");
                setInputValue(value);
            }else {
                setInputValue(e.target.value);
            }            
        }
    }

    useEffect(()=>{
        dispatch(storeSearchQuery(inputValue));
    },[inputValue])

    
    return (
    <>
    <button onClick={()=> setInputValue("")} className='bg-orange-300 py-1 px-2 rounded-lg'>Reset All Filters</button>
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
    {
        list.map(val => (
            <div key={val.number}>
                <div className="font-semibold italic text-purple-600 mb-2">{val.domain}</div>
                <div className="space-y-2">
                    {
                        val.values.map(item => (
                            <label key={item} className="flex items-center space-x-2 text-gray-700">
                                <input 
                                    type="radio"
                                    name={inputValue}
                                    value={item}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-purple-600  border-gray-300 rounded"
                                />
                                <span>{item}</span>
                            </label>
                        ))
                    }
                </div>
            </div>
        ))
    }
    </div>
    </>
    )
}

export default JobsFilter;
