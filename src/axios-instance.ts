import axios from "axios";
import { error } from "console";
import https from "https";
import { logger } from "./logger";

const AxiosInstance = axios.create({
    baseURL: "",
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

AxiosInstance.interceptors.response.use(
    res => res,
    err => {
      logger.error({function: "AxiosInstance", errorMsg: err.message})
    }
  )
export default AxiosInstance;