import axios from "axios";
import { BASE_URL } from "../../base";
const  BaseUrl = 'http://173.249.48.121:4457';


export const createIntersetApi =async(data)=>{
    try {
        const response = await axios.post(`${BaseUrl}/interest/create`,data)
        return response
    } catch (error) {
        console.log(error)
      throw error;   

    }
}

export const getAllInterestApi = async(modeid)=>{
    try {
        const response = await axios.get(`${BaseUrl}/interest/getall/${modeid}?page_no=1&page_size=100`)
        return response
    } catch (error) {
        console.log(error)  
      throw error;   
        
    }
}

export const deleteInterestApi=async(id)=>{
    try {
        const resoponse = await axios.delete(`${BaseUrl}/interest/remove/${id}`)
        return resoponse
    } catch (error) {
      console.log(error) 
      throw error;   
    }
}

export const updateInterest = async (data) => {
    const { editId, values } = data;
    const options = {
      method:'PUT',
      headers: {
        'content-type':'application/json',
      },
      body: JSON.stringify(values),
    };
    try {
      const response = await fetch(
        `${BASE_URL}/interest/update/${editId}`,
        options
      );
      const dataaa = await response.json()
      return  dataaa; // Fixed the variable name here
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const searchUser = async (name) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    try {
      const response = await fetch(
        `${BASE_URL}/users/search?name=${name}`,
        options
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const searchInterest = async (name) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    try {
      const response = await fetch(
        `${BASE_URL}/interest/search/6565dbb8f55b057bd1fc4a82?name=${name}`,
        options
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
    
  export const sortInterest =async(sort)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  
    try {
      const response = await fetch(
        `${BASE_URL}/interest/sort/6565dbb8f55b057bd1fc4a82?sort=${sort}`,
        options
      );
      const responseData = await response.json();
      return responseData; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }