import axios from "axios";

const useUpdate = () => {
  const updateData = async (url, data, token) => {
    const controller = new AbortController();

    try {
      const response = await axios.put(url, data, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.error || error?.message || "Unknown error";

      // Throw the error so React Query's onError can catch it
      throw new Error(message);
    }
  };

  return updateData;
};

export default useUpdate;
