import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://percel-web-application-production.up.railway.app'
})

const useAxios = () => {
    return axiosInstance;
}

export default useAxios;