import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).token
    : false;
const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

export const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCertainCategory = async (data) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/category/certain-category`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async ({
  cName,
  aName,
  cImage,
  cDescription,
  aDescription,
  cSubCategory,
  aSubCategory,
  cType,
  cStatus,
}) => {
  let formData = new FormData();
  formData.append("cImage", cImage);
  formData.append("cName", cName);
  formData.append("aName", aName);
  formData.append("cDescription", cDescription);
  formData.append("aDescription", aDescription);
  formData.append("cSubCategory", cSubCategory);
  formData.append("aSubCategory", aSubCategory);
  formData.append("cStatus", cStatus);
  formData.append("cType", cType);

  try {
    let res = await axios.post(
      `${apiURL}/api/category/add-category`,
      formData,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (cId, des, status) => {
  let data = { cId: cId, cDescription: des, cStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/category/edit-category`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (cId) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/category/delete-category`,
      { cId },
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
