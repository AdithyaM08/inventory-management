import axios from "axios";

const MATERIAL_BASE_URL = "http://localhost:8081/material";

export const getMaterialCategories = () => {
  return axios.get(
    `${MATERIAL_BASE_URL}/material/controller/getMaterialCategories`,
  );
};

export const getMaterialCategoryById = (categoryId) => {
  return axios.get(
    `${MATERIAL_BASE_URL}/material/controller/getMaterialCategoryById/${categoryId}`,
  );
};

export const getMaterialTypes = () => {
  return axios.get(`${MATERIAL_BASE_URL}/type/controller/getTypeDetails`);
};

export const getMaterialTypesByCategory = (categoryId) => {
  return axios.get(
    `${MATERIAL_BASE_URL}/type/controller/getTypeDetailsByCategoryId/${categoryId}`,
  );
};

export const getUnits = () => {
  return axios.get(`${MATERIAL_BASE_URL}/unit/controller/getUnitDetails`);
};

export const getUnitsByCategory = (categoryId) => {
  return axios.get(
    `${MATERIAL_BASE_URL}/unit/controller/getUnitsByCategoryId/${categoryId}`,
  );
};
