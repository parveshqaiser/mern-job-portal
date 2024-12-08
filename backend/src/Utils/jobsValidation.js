

const jobsValidation = (req, hasCreateJob) => {

    let{title, description, requirements, salary, location, openings, jobType, company , workExperience , qualification} = req.body;


    if(!title || !description || !salary || !location || !openings  || !workExperience || !qualification) 
    {
        // return res.status(400).json({message : "Input Field Missing"});
        throw new Error("Input Field Missing");
    }

    let allowedJobTypes = ["Full Time", "Part Time", "Remote","Contract"];

    if(!allowedJobTypes.includes(jobType)){
        throw new Error("Invalid Job type");
    }

    if(hasCreateJob && !company){
        throw new Error("Company Required");
    }

    if(title && title.trim()== "")
    {
        throw new Error("Job Title Required");
    }

    if(description && description.trim()== "")
    {
        throw new Error("Job Description Required");
    }

    if(salary && salary.trim()== "")
    {
        throw new Error("Salary Range Required");
    }

    if(location && location.trim()== "")
    {
        throw new Error("Location Required");
    }

    if(openings && openings.trim()== "")
    {
        throw new Error("Number of Openings Required");
    }

    if(jobType && jobType.trim()== "")
    {
        throw new Error("Job type Required");
    }

    if(hasCreateJob && company && company.trim()== "")
    {
        throw new Error("Company Id Required");
    }

    if(workExperience && workExperience.trim()== "")
    {
        throw new Error("Work Experience Required");
    }

    if(qualification && qualification.trim()== "")
    {
        throw new Error("Qualification Required");
    }

    if (hasCreateJob){
        if(!requirements || requirements.trim()== "")
        {
            throw new Error("Requirements Required");
        }
    }
   
}

export default jobsValidation;
