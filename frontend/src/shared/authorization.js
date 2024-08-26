

// use this whenever there is file upload
export const getAuthHeaders = () => {

    let userDetails = undefined;
    let headerInfo = "";

    if (typeof window !== "undefined") {
        userDetails = JSON.parse(localStorage.getItem("user"));
    }

    if (userDetails?.generateToken) {
        headerInfo = {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${userDetails.generateToken}`,
        };
    }
    return {headerInfo , userDetails};
};



export const getAuthHeadersOfApplicationJson = () => {

    let userDetails = undefined;
    let headerInfo = undefined;

    if (typeof window !== "undefined") {
        userDetails = JSON.parse(localStorage.getItem("user"));
    }

    if (userDetails?.generateToken) {
        headerInfo = {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${userDetails.generateToken}`,
        };
    }
    return headerInfo;
};

