import { createContext, useState } from "react";

const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const persistValue = localStorage.getItem("persist");
  const [persist, setPersist] = useState(persistValue == "true" || false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [code, setCode] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        forgotPassword,
        setForgotPassword,
        verifyOTP,
        setVerifyOTP,
        changePassword,
        setChangePassword,
        code,
        setCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
