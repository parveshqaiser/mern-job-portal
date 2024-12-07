
import {jobDetails} from "../Model/jobSchema.js";
import {nanoid} from "nanoid";
import jobsValidation from "../Utils/jobsValidation.js";

export const createJobs = async (req,res)=>{
    try {
        let{title, description, requirements, salary, location, openings, jobType, company , workExperience , qualification} = req.body;

        let userId = req.id;
        let hasCreateJob = true;

        jobsValidation(req,hasCreateJob);

        let generateJobId = await nanoid(8);

        let insertJob = await jobDetails.create({
            jobId : generateJobId,
            title,
            isJobExpired : "false",
            description,
            requirements :requirements.split(",") || [],
            salary, 
            location, 
            openings, 
            jobType,
            workExperience,
            qualification,
            created_by : userId,
            company,
            application : []
        });

        if(!insertJob)
        {
            return res.status(500).json({ message: "Something went wrong while creating jobs.", success: false });
        }

        res.status(201).json({message :"Job Created Successfully", success : true , insertJob});
        // res.status(201).json({message : "Testing"})

    } catch (error) {
        console.log("error while creating job ", error.message);
        return res.status(500).json({
            message: `${error.message}`,
            success: false
        });
    }
}

export const getAllJobs = async(req, res)=>{
    try {
        let keyword = req.query.keyword || "";
       
        let keywords = keyword.split(" ");

        let regexQueries = keywords.map(k => {

            let ignoreSpace =  k.replace(/\s+/g, ''); 
            return {
                $or: [
                    { title: { $regex: ignoreSpace, $options: "i" } },
                    { description: { $regex: ignoreSpace, $options: "i" } },
                    { location: { $regex: ignoreSpace, $options: "i" } },
                    { salary: { $regex: ignoreSpace, $options: "i" } }
                ]
            };
        });

        let query = [
            {
                $match: {
                    $and: regexQueries
                }
            },
            {
                $lookup: {
                    from: "companies", 
                    localField: "company", 
                    foreignField: "companyId",
                    as: "companyDetails" 
                }
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ];


        // let allJobs = await jobDetails.find(query).populate({path :"company" , strictPopulate : false}).sort({createdAt: -1});
        let allJobs = await jobDetails.aggregate(query);

        return res.status(200).json({
            allJobs,
            success: true,
            message: allJobs.length ? "Jobs fetched successfully" : "No jobs available"
        });

    } catch (error) {
        console.log("error getting all jobs ", error)
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
}

export const getJobById = async(req,res)=>{

    try {
        let jobId = req.params.id;
        let keyword = req.query.keyword || "";

        let query = [
            {
                $match : {
                    jobId : jobId,
                    $or : [
                        { title: { $regex: keyword, $options: "i" }},
                        { description: { $regex: keyword, $options: "i" }}
                    ]
                }
            },
            {
                $lookup : {
                    from : "companies",
                    localField : "company",
                    foreignField :"companyId",
                    as : "companyDetails"
                }
            },
            {
                $unwind: "$companyDetails"
            },
            {
                $sort: { createdAt: -1 }
            }
        ]

        let getJob = await jobDetails.aggregate(query);

        if(getJob == null || getJob== undefined)
        {
            return res.status(404).json({message: "No Job Found", success : false})
        }

        return res.status(200).json({getJob , success : true});

    } catch (error) {
        console.log("error getting job by ID",error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

// wil use by admin
export const getAdminJobs = async(req, res)=>{
    try {
        let userId = req.id;
        let keyword = req.query.keyword || "";

        let query = [
            {
                $match : {
                    created_by : userId,
                    $or : [
                        { title: { $regex: keyword, $options: "i" }},
                        { description: { $regex: keyword, $options: "i" }}
                    ]
                }
            },
            {
                $lookup : {
                    from : "companies",
                    localField : "company",
                    foreignField :"companyId",
                    as : "companyDetails"
                }
            },
            {
                $unwind : {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ];

        let getJobByUserId = await  jobDetails.aggregate(query);

        return res.status(200).json({getJobByUserId , success : true , message : getJobByUserId.length ? "Jobs Fetched" :"Jobs Admin Jobs" })

    } catch (error) {
        console.log("error getting admin job by ID", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
}

export const updateJob = async(req, res)=>{

    try {
        let jobId = req.params.id;
        let hasCreateJob = false;

        let {title, isJobExpired, description, salary, location,openings, jobType , qualification,workExperience} = req.body;

        // let allowed =["title", "isJobExpired", "description", "salary"];

        // let isAllowed = Object.keys(req.body).every(k=> allowed.includes(k));

        jobsValidation(req, hasCreateJob)

        let update = await jobDetails.findOne({jobId});

        update.title = title || "",
        update.isJobExpired = isJobExpired || "",
        update.description = description || "",
        update.salary = salary || "",
        update.location = location || "",
        update.openings = openings || "",
        update.jobType = jobType || "",
        update.qualification = qualification || "",  
        update.workExperience = workExperience || ""    

        await update.save();

        res.status(200).json({message :"Job Updated", success : true});

    } catch (error) {
        console.log("error in updating job id", error);
        return res.status(500).json({
            message: `${error.message}`,
            success: false
        });
    }
}
 