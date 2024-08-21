import React from 'react'
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({val, myKeys}) => {

    let navigate = useNavigate();
    return (
    <div key={myKeys} onClick={()=> navigate(`/jobs/apply/${val?.jobId}`)} className='p-3 shadow-lg m-2 cursor-pointer bg-white rounded-lg hover:shadow-xl transition-shadow duration-300'>
        <div className='border-b pb-2 mb-3'>
            <h1 className='text-xl font-semibold text-gray-800'>{val?.companyDetails?.companyName}</h1>
            <p className='text-sm text-gray-500'>{val?.location}</p>
        </div>
        <div className='border-b pb-2 mb-3'>
            <h1 className='text-lg font-medium text-gray-700'>{val?.title}</h1>
            <p className='text-sm text-gray-600'>{val?.description?.slice(0,25)}....</p>
        </div>
        <div className='flex justify-between items-center text-sm text-gray-600'>
            <span className='px-2 py-1 bg-blue-100 text-blue-500 rounded'>{val?.jobType}</span>
            <span className='font-semibold'>{val?.salary ? `₹ ${val.salary} LPA` : 'Salary not specified'}</span>
            <span className='px-2 py-1 bg-orange-100 text-orange-500 rounded'>Openings {val?.openings || "NA"}</span>
        </div>
    </div>
    )
}

export default LatestJobCards;
