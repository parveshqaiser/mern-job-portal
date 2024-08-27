
import React from 'react'
import { useSelector } from 'react-redux'
import { modifyDateFormat } from '../utils/dayConverter';

const ProfileTable = ({isLoading}) => {

    let allJobs = useSelector(store => store?.application?.allApplication);

    return (
        <div className='overflow-x-auto'>
            <table className='table-auto min-w-full my-4 border-collapse'>
                <thead>
                    <tr className='bg-gray-300'>
                        <th className='p-2 border border-gray-400'>Logo</th>
                        <th className='p-2 border border-gray-400'>Company</th>
                        <th className='p-2 border border-gray-400'>Job Title</th>
                        <th className='p-2 border border-gray-400'>Applied Date</th>
                        <th className='p-2 border border-gray-400'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="5" className='font-semibold text-center p-4'>Loading....</td>
                        </tr>
                    ) : allJobs && allJobs.length ? allJobs.map((val, index) => (
                        <tr key={index}>
                            <td className='p-2 border border-gray-400 w-24'>
                                <img className='w-20 rounded-md' src={val?.companyDetails?.logo || "NA"} />
                            </td>
                            <td className='p-2 border border-gray-400'>{val?.companyDetails?.companyName}</td>
                            <td className='p-2 border border-gray-400'>{val?.jobDetails?.title}</td>
                            <td className='p-2 border border-gray-400'>{modifyDateFormat(val?.createdAt?.split("T")[0])}</td>
                            <td className='p-2 border border-gray-400'>
                                <span className={`text-sm px-2 py-1 rounded 
                                ${val.status == "Accepted"? "bg-green-200 text-green-600" : val.status=="Rejected" ? "text-red-600 bg-red-300" : "bg-gray-200"}  `}>
                                    {val?.status}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className='text-center p-4'>
                                <span className='text-red-500 font-semibold'>You Haven't applied for any job yet.</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ProfileTable
