import axios from "axios";

const VENDOR_BASE_URL = "http://localhost:8081/vendor";

export const getVendors = () => {
  return axios.get(`${VENDOR_BASE_URL}/vendor/controller/getVendors`);
};