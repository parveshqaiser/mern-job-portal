import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SingUpPage from "./components/SingUpPage";
import ErrorPage from "./components/ErrorPage";
import JobsPage from "./components/JobsPage";
import Browse from "./components/Browse";
import ProfilePage from "./components/ProfilePage";
import AdminCompanies from "./components/Admin/AdminCompanies";
import AdminJobs from "./components/Admin/AdminJobs";
import RegisterCompany from "./components/Admin/RegisterCompany";
import UpdateCompany from "./components/Admin/UpdateCompany";
import CreateJobs from "./components/Admin/CreateJobs";
import AdminJobsApplicant from "./components/Admin/AdminJobsApplicant";
import ApplyJobs from "./components/ApplyJobs";
import ProtectedRoutes from "./components/ProtectedRoutes";


const App = ()=>{

   let appRoutes = createBrowserRouter([
    {
        path : "/",
        element : <LoginPage />
    },
    {
        path : "/login",
        element : <LoginPage />
    },
    {
        path : "/home",
        element : <HomePage />
    },   
    {
        path : "/signup",
        element : <SingUpPage />
    },
    {
        path : "/jobs",
        element : <JobsPage />
    },
    {
        path : "/browse",
        element : <Browse />
    },
    {
        path : "/jobs/apply/:id",
        element : <ApplyJobs />
    },
    {
        path : "/profile",
        element : <ProfilePage />
    },
    {
        path : "/admin/companies",
        element :<ProtectedRoutes><AdminCompanies /></ProtectedRoutes> 
    },
    {
        path : "/admin/companies/register",
        element :<ProtectedRoutes> <RegisterCompany /> </ProtectedRoutes>
    },
    {
        path : "/admin/companies/update/:id",
        element : <ProtectedRoutes>  <UpdateCompany /> </ProtectedRoutes>
    },
    {
        path : "/admin/jobs",
        element : <ProtectedRoutes> <AdminJobs /> </ProtectedRoutes>
    },
    {
        path : "/admin/jobs/create",
        element : <ProtectedRoutes> <CreateJobs /> </ProtectedRoutes>
    },
    {
        path : "/admin/jobs/:id/applicants",
        element : <ProtectedRoutes> <AdminJobsApplicant /> </ProtectedRoutes>
    },
    {
        path:"*",
        element : <ErrorPage />
    },
   ]);


    return(
        <RouterProvider router={appRoutes}>
            
        </RouterProvider>
    )
}

export default App;