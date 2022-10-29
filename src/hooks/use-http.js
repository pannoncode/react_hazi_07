import { useState } from "react";

const useHttp = () => {
  const [error, setError] = useState();

  const sendRequest = async (request, applyData) => {
    try {
      const response = await fetch(request.url, {
        method: request.method ? request.method : "GET",
        headers: request.headers ? request.headers : {},
        body: request.body ? JSON.stringify(request.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      applyData(data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };
  return {
    error,
    sendRequest,
  };
};

export default useHttp;
