import axios from "axios";

const useDelete = () => {
    
  const deleteData = async (url, token) => {
    const controller = new AbortController(); // Define controller inside the function
    let result;

    try {
      const response = await axios.delete(url, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      result = response;
    } catch (error) {
      // console.error("Error deleting data:", error.message || error);
      return { success: false, error: error.message || error };
    }

    return result; 
  };

  return deleteData;
};

export default useDelete;
