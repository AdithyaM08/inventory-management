import axios from "axios";

const INVENTORY_BASE_URL = "http://localhost:8081/inventory";

export const addPurchaseDetail = (purchaseData) => {
  return axios.post(
    `${INVENTORY_BASE_URL}/addPurchaseDetail`,
    purchaseData
  );
};

export const getPurchaseDetails = (reportData) => {
  return axios.post(
    `${INVENTORY_BASE_URL}/report/controller/getPurchaseDetails`,
    reportData
  );
};