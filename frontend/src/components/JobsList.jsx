
import React from 'react'
import { useNavigate } from 'react-router-dom';
import getPostedDays from '../utils/dayConverter';

const JobsList = ({val, myKeys}) => {

    let navigate = useNavigate();

    return (
        <div key={myKeys} className='p-3 shadow-xl rounded-lg m-2  bg-white  hover:shadow-xl transition-shadow duration-300'>
            <div className='border-b pb-2 mb-3 flex justify-between items-center'>
                <span className='text-gray-400'>{getPostedDays(val?.createdAt)}</span>
                <span className='w-20'>
                    <img src={val?.companyDetails?.logo} className='w-20 rounded-md' />
                </span>
            </div>
            <p className='font-bold text-lg'>{val?.title || "NA"}</p>
            <p>{val?.description?.slice(0,20) || "NA"}...</p>
            <div className='flex justify-between items-center text-sm text-gray-600 my-3 border-b pb-2 mb-3'>
                <span className='px-2 py-1 bg-blue-100 text-blue-500 rounded'>{val?.jobType}</span>
                <span className='font-semibold'> ₹ {val?.salary} LPA</span>
                <span className='px-2 py-1 bg-orange-100 text-orange-500 rounded'>Openings {val?.openings}</span>
            </div>    
            <div className=' flex justify-between gap-3'>
                <button  
                    onClick={()=> navigate(`/jobs/apply/${val?.jobId}`)}
                    className='bg-white border-purple-600 border-1 text-purple-500 hover:bg-[#7209b7] py-1 px-2 rounded-md'>
                        More Details
                </button>
                {/* <button className='bg-blue-500 text-white hover:bg-[#7209b7] py-1 px-4 rounded-md'>Save</button> */}
            </div>   
        </div>
    )
}

export default JobsList;

// <div className='p-3 shadow-lg m-2 cursor-pointer bg-white rounded-lg hover:shadow-xl transition-shadow duration-300'>
//         <div className='border-b pb-2 mb-3'>
//             <h1 className='text-xl font-semibold text-gray-800'>{val?.companyDetails?.companyName}</h1>
//             <p className='text-sm text-gray-500'>{val?.location}</p>
//         </div>
//         <div className='border-b pb-2 mb-3'>
//             <h1 className='text-lg font-medium text-gray-700'>{val?.title}</h1>
//             <p className='text-sm text-gray-600'>{val?.description?.slice(0,25)}....</p>
//         </div>
//         <div className='flex justify-between items-center text-sm text-gray-600'>
//             <span className='px-2 py-1 bg-blue-100 text-blue-500 rounded'>{val?.jobType}</span>
//             <span className='font-semibold'>{val?.salary ? `₹ ${val.salary} LPA` : 'Salary not specified'}</span>
//             <span className='px-2 py-1 bg-orange-100 text-orange-500 rounded'>Openings {val?.openings || "NA"}</span>
//         </div>
//     </div>


