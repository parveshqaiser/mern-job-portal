
import { applicationDetails } from "../Model/applicationSchema.js";
import { jobDetails } from "../Model/jobSchema.js";

// student will apply for job
export const applyForJobs = async(req, res) => {

    try {
        let userId = req.id;
        let jobId = req.params.id;
        
        if(!jobId){
            return res.status(400).json({message : "Job ID Not found ", success : false});
        }

        let isApplicationExist = await applicationDetails.findOne({job : jobId , applicant : userId});
      
        if(isApplicationExist){
            return res.status(400).json({message : "You have already applied for the Selected Job", success : false});
        }

        let findJob = await jobDetails.findOne({jobId});


        if(findJob == null){
            return res.status(400).json({message : "Job Not found ", success : false});
        }

        let createApplication = await applicationDetails.create({
            job : jobId,
            applicant : userId
        });

        findJob.application.push(createApplication._id);
        // findJob.application.push(userId)
        await findJob.save();

        return res.status(201).json({message :"Job Applied Successfully", success : true});

    } catch (error) {
        console.log("error applying for jobs ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
}

export const getAllJobsAppliedByStudent = async(req, res)=>{
    try {
        let userId = req.id;
        let query = [
            {
                $match: {applicant: userId }
            },
            {
                $lookup: {
                    from: "jobs", 
                    localField: "job",
                    foreignField: "jobId",
                    as: "jobDetails",
                }
            },
            {
                $unwind: "$jobDetails"  // Unwind the applicationDetails array
            },
            {
                $lookup: { 
                    from: "companies",
                    localField: "jobDetails.company",
                    foreignField: "companyId",
                    as: "companyDetails"
                }
            },
            {
                $unwind: "$companyDetails"
            },
        ];

        let getAllApplications = await applicationDetails.aggregate(query);

        // let getAllApplications = await applicationDetails.find({applicant : userId}).populate({strictPopulate : false , path :"jobs"});
        if(!getAllApplications)
        {
            return res.status(400).json({message : "No Application Found", success : false});
        }

        return res.status(200).json({getAllApplications , success : true});

    } catch (error) {
        console.log("error getting user applied jobs", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
}


// will access by admin
export const getApplicants = async (req,res)=>{
    try {
        let jobId = req.params.id;
        let userId = req.id;

        let query = [
            {
                $match: { jobId: jobId } 
            },
            {
                $lookup: { 
                    from: "applications",
                    localField: "application",
                    foreignField: "_id",
                    as: "applicationDetails"
                }
            },
            {
                $unwind: "$applicationDetails"
            },
            {
                $lookup: {
                    from: "registers", 
                    localField: "applicationDetails.applicant",
                    foreignField: "userId",
                    as: "userDetails",
                }
            },
            {
                $unwind: "$userDetails"
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
                $unwind: "$companyDetails"
            },
            {
                $group: {
                    _id: {
                        jobId: "$jobId",
                        title: "$title",
                        openings: "$openings",
                        companyName: "$companyDetails.companyName",
                        logo: "$companyDetails.logo"
                    },
                    userDetails: { 
                        $push: {
                            userId: "$userDetails.userId",
                            fullName: "$userDetails.fullName",
                            email: "$userDetails.email",     
                            mobile: "$userDetails.mobile",   
                            role: "$userDetails.role", 
                            profile: "$userDetails.profile",
                            status: "$applicationDetails.status",
                        }
                    },
                }
            },
        ];
        

        let findApplicants = await jobDetails.aggregate(query);

        if(!findApplicants){
            return res.status(404) .json({message : "No Applicants found for this job",success : false});
        }

        return res.status(200).json({findApplicants, success:true});

    } catch (error) {
        console.log("error in getting all applicants details ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};


// will access by admin
export const updateApplicationStatus = async(req,res)=>{
    try {
        let status = req.body.status;
        let jobId = req.body.jobId; // from front end
        let userId = req.params.id; // as params user id

        if(!status)
        {
            return res.status(400).json({message : "Status Required", success : false});
        }

        let findApplication = await applicationDetails.findOne({job : jobId , applicant : userId}); // find that job with the help of job id and user id

        if(!findApplication){
            return res.status(404).json({message : "Application Not Found", success : false})
        }

        findApplication.status = status;
        await findApplication.save();
        return res.status(200).json({message : "Application Updated", success : true})

    } catch (error) {
        console.log("error updating app status",error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

