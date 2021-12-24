import { PHOTOS_BY_ID_API_ENDPOINT } from '../constants/api.constants'; 

export const getPhotoById = async (id: number): Promise<Response> => {
    if (!id) {
      return;
    }
  
    const response = await fetch(`${window.location.href}${PHOTOS_BY_ID_API_ENDPOINT}/${id}`, { method: "GET" });
  
    if (!response.ok) {
      return Promise.reject(response);
    }
  
    return response;
};
