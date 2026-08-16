import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("refresh", {
      withCredentials:true,
      headers: {"Access-Control-Allow-Origin":"*", "Content-Type": "application/json",},
      credentials: "include",
      
  });
    setAuth(response.data);
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken