import React, { createContext, useState } from "react";

export const LoadingContext = createContext();

const LoadingProvider = ({ children }) => {
  const [loading, setloading] = useState(false);


  const value = {loading,setloading };
  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
