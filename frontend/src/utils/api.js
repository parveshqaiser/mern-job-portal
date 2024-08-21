
export const commonEndPoints = "http://127.0.0.1:5000";

export const headers = {
   "Content-type": "application/json", // Content-Type should be in lowercase
    "Authorization": `Bearer `, // Removed space after "Authorization" & give single space after bearer
};

export const updateProfileApi = "http://127.0.0.1:5000/update/profile";

export const getUserData = "http://127.0.0.1:5000/getUserData";

export const logout = "http://127.0.0.1:5000/logout";

export const getAllJobs = "http://127.0.0.1:5000/getAllJobs";

// "Content-type": "Application/json",
// Authorization: `Bearer ${auth_token}`,
