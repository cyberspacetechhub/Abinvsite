import axios from 'axios';

const usePost = () => {
  const postData = async (url, data, token) => {
    const controller = new AbortController(); // Create the controller

    try {
      // Send the POST request
      const response = await axios.post(url, data, {
        signal: controller.signal, // Add the abort signal
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // For form data
        },
      });

      return response;
    } catch (error) {
      // console.error('Error during POST request:', error);
      throw error; // Let the caller handle the error
    }
  };

  return postData; // Return the function, not the result of calling the function
};

export default usePost;


{/*  */}