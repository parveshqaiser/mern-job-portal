import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar'
import { faUserPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

import {useSelector } from 'react-redux'
import useGetAllCompanies from "../../shared/useGetALlCompanies";
import { AlertMessage } from '../../utils/toastify'
import { defaultImageLogo } from '../../utils/constants'
import { modifyDateFormat } from '../../utils/dayConverter'
 
const AdminCompanies = () => {

    let navigate = useNavigate();

    let{isLoading , tableData} = useGetAllCompanies();
    let allCompanies = useSelector(store=> store?.company?.allCompanies);

    const [filterData, setFilterData] = useState(allCompanies);
    const [searchText , setSearchText] = useState("");

    useEffect(()=>{
        if(searchText!=="")
        {
            let filtered = allCompanies.length && allCompanies.filter((val)=> val?.companyName?.toLowerCase().includes(searchText.toLowerCase()));
            setFilterData(filtered || []);
        }else {
            setFilterData(allCompanies);
        }
    },[searchText , allCompanies])

    return (
    <>
        <NavBar />
        <AlertMessage />
        <div className='max-w-6xl m-auto mt-4'>
            <div className='flex justify-between items-center'>
                <div>
                    <label className='block font-medium'>Filter Companies</label>
                    <input 
                        type='text'
                        placeholder='Filter Companies'
                        onChange={(e)=> setSearchText(e.target.value)}
                        className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                </div>
                <div>
                    <button 
                        onClick={()=> navigate("/admin/companies/register")}
                        className='bg-orange-300 p-2 rounded-md hover:bg-orange-600 hover:text-white'>Add Company
                    </button>
                </div>
            </div>

            <table className='table mt-5'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Logo</th>
                        <th>Company</th>
                        <th>Registered Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                {
                    isLoading ? (
                        <tr>
                            <td colSpan="5" className=' font-semibold text-center'>Loading....</td>
                        </tr>
                    ) :filterData && filterData.length ? filterData.map((val,index) =>(
                        <tr className='' key={index}>
                            <td>{index + 1}</td>
                            <td className='w-25 h-25'>
                                <img 
                                    className='w-20 rounded-md'
                                    src={val.logo || defaultImageLogo} 
                                />
                            </td>
                            <td>{val.companyName}</td>
                            <td>{modifyDateFormat(val?.createdAt?.split("T")[0])}</td>
                            <td>
                                <FontAwesomeIcon onClick={()=> navigate(`/admin/companies/update/${val.companyId}`)} icon={faUserPen} title='Edit Company'  className='cursor-pointer text-purple-500 w-6 h-6' />
                            </td>
                        </tr>
                    )): searchText.length ? (
                        <tr>
                            <td colSpan="5" className='font-semibold text-center'>
                            <span className='text-red-600'>"{searchText}" , No Results Found</span>
                            </td>
                        </tr>) :(
                        <tr>
                            <td colSpan="5" className='font-semibold text-center'>
                            <span className='text-red-600'>No company details found. Please add a company to see the details here.</span>
                            </td>
                        </tr>
                    )
                }
                   
                </tbody>
            </table>
        </div>
    </>
    )
}
export default AdminCompanies;
