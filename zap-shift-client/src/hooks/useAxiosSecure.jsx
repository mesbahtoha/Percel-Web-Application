import { authHttpClient } from "../api/http";

const useAxiosSecure = () => {
  return authHttpClient;
};

export default useAxiosSecure;
