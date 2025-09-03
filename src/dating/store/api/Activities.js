import axios from "axios";
import { BASE_URL } from '../../../base';

export const createActivity =async(Data) => {
  console.log(Data);
  try {
    const response = await axios.post(`${BASE_URL}/activitys/createActivity`,Data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const allActivities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/User/activity/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const allUserActivities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/activitys/getall/6565dbb8f55b057bd1fc4a82?page_number=1&page_size=100`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
export const getBySenderUserId = async(data)=>{
  const {modeid,id} =data 
  try {
      const response = await axios.get(`${BASE_URL}/activitys/getBySenderUserId/${id}?modeId=${modeid}&page_no=1&page_size=100`)
      return response
  } catch (error) {
      console.log(error)  
    throw error;   
      
  }
}

export const getActivitysByUserId = async(data)=>{
  const {id} =data 

  try {
      const response = await axios.get(`${BASE_URL}/activitys/getByUserId/${id}?page_number=1&page_size=122`)
      return response
  } catch (error) {
      console.log(error)  
    throw error;   
      
  }
}

export const deleteActivityApi=async(_id)=>{
 
  try {
      const resoponse = await axios.delete(`${BASE_URL}/activitys/deleteActivity/${_id}`)
      return resoponse
  } catch (error) {
    console.log(error) 
    throw error;   
  }
}
export const updateActivity = async (data) => {
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
      `https://datingapi.meander.software/Activity/update/${editId}`,
      options
    );
    const dataaa = await response.json()
    console.log(dataaa)

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
      `https://datingapi.meander.software/users/search?name=${name}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    
    return responseData; // Assuming the response is already JSON, no need to stringify.
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const searchActivity = async (name) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(
      `https://datingapi.meander.software/Activity/search/6565dbb8f55b057bd1fc4a82?name=${name}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    
    return responseData; // Assuming the response is already JSON, no need to stringify.
  } catch (error) {
    console.error(error);
    throw error;
  }
};
  
export const sortActivity =async(sort)=>{
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const response = await fetch(
      `https://datingapi.meander.software/Activity/sort/6565dbb8f55b057bd1fc4a82?sort=${sort}`,
      options
    );
    const responseData = await response.json();
    console.log(responseData);
    
    return responseData; 
  } catch (error) {
    console.error(error);
    throw error;
  }
}