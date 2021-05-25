import axios from "axios";
import https from "https";

const AxiosInstance = axios.create({
    baseURL: "",
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});


export default AxiosInstance;