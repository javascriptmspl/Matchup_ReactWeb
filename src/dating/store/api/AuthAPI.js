import axios from "axios";
import { BASE_URL } from "../../../base";
import store from "../../../hooks/useLocalStorage";
import { log } from "handlebars/runtime";

export const Local_User = JSON.parse(localStorage.getItem('userData'))
export const UserID =Local_User?.data?._id


const _id = Local_User?._id
//login Api
export const userLogin = async (credentials) => {
  try {
    
    const response = await axios.post(`${BASE_URL}/User/login`, credentials);
    const data = response.data;

     localStorage.setItem("token", data.token);
     localStorage.setItem("userData", JSON.stringify(data));

    return data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("Bad Request: Invalid login credentials.");
    } else if (error.response && error.response.status === 401) {
      console.log(
        "Unauthorized: Invalid credentials or user not authenticated."
      );
    } else if (error.response && error.response.status === 500) {
      console.log("Internal Server Error: Something went wrong on the server.");
    } else {
      console.log("Server Error: An error occurred on the server side.");
    }
  }
};
//create user Api
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/User/create`, userData);
    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("userData", JSON.stringify(data));

    return data;
  } catch (error) {
    throw error;
  }
};

// create Login
export const sentOtpApi = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/User/loginWithEmail`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

//user get by id
export const getbyiduser = async (data) => {
  try {
    const resoponse = await axios.get(`${BASE_URL}/User/getById/${data?data:_id}`);
    return resoponse.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// verify otp
// token set karna ha abhi
export const verifyOTPApi = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/User/verifyOtpEmail`, data);
    localStorage.setItem("userData", JSON.stringify(response.data.data.data));

    return response.data;
  } catch (error) {
    throw error;
  }
};
// export const verifyOTPApi = async (data)=>{
//   const options ={
//     method:'POST',
//     headers:{
//       'content-type':'application/json',
//     },
//     body:JSON.stringify(data)

//   }
//   try {
//     debugger
//     const response = await fetch(`${BASE_URL}/User/verifyOtpEmail`,options)
//     console(response)
//     return response
//   } catch (error) {
//     throw error

//   }
// }

export const forgotPassword = async (data) => {
  localStorage.setItem("forgetemail", data?.email);
  try {
    const response = await axios.post(`${BASE_URL}/User/forgot-password`, data);
    localStorage.setItem("usertoken", response?.data?.token);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("Bad Request: Invalid email.");
    } else if (error.response && error.response.status === 401) {
      console.log("Unauthorized: User is not authenticated.");
    } else if (error.response && error.response.status === 500) {
      console.log("Internal Server Error: Something went wrong on the server.");
    } else {
      console.log("Server Error: An error occurred on the server side.");
    }
  }
};

export const verifyOTP = async (otpData) => {
  try {
    // Make an API request to verify the OTP
    const token = localStorage.getItem("usertoken");
    const data = {
      otp: otpData,
      token: token,
    };
    const response = await axios.post(`${BASE_URL}/User/verifyOTP`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("Bad Request: Invalid OTP or data.");
    } else if (error.response && error.response.status === 401) {
      console.log(
        "Unauthorized: Invalid credentials or user not authenticated."
      );
    } else if (error.response && error.response.status === 500) {
      console.log("Internal Server Error: Something went wrong on the server.");
    } else {
      console.log("Server Error: An error occurred on the server side.");
    }
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const resetdata = {
      email: localStorage.getItem("forgetemail"),
      newPassword: passwordData,
    };
    const token = localStorage.getItem("usertoken");
    const response = await axios.post(
      `${BASE_URL}/User/resetPassword`,
      resetdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//update user by id
export const updateUserByIdMetri = async (userData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/User/update/${userData._id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
