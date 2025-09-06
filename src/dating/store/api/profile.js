import axios from "axios";
import { BASE_URL } from "../../../base";


// Profile picture upload
export const uploadProfilePicture = async (imageData, userId) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('userId', userId);
  
      const response = await axios.put(`${BASE_URL}/User/uploadMainProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    } 
  };

  //  user pictures upload 
  export const uploadMultiPicture = async (imageData, userId) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('userId', userId);
  
      const response = await axios.put(`${BASE_URL}/User/uploadProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    } 
  };
  

  export const updateUserInterests = async (userId, interests) => {
    try {
      const response = await axios.put(`${BASE_URL}/User/update/${userId}`, {
        interest: interests,
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //get user profile 
  export const getUserById = async (userId) => {
    try {
      const response = await axios.get( `${BASE_URL}/User/getById/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //update user profile
  export const updateUserProfile = async (updatedUserData,userId) => {
    try {
      const response = await axios.put(`${BASE_URL}/User/update/${userId}`, updatedUserData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  //