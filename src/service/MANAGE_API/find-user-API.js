import axios from "axios";
import { BASE_URL } from "../../base";
import { modeId } from "../../utils";

export const getFindPartnerAPI = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/User/getall/${modeId}?page_no=1&page_size=100`
        );
        return response.data
    } catch (error) {
        
        console.error("Error fetching members:", error);
    }
};


export const SearchFindPartnerAPI = async (query) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/User/search?q=${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error);
    }
};