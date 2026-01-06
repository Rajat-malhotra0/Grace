import axios from "axios";
import { withApiBase } from "config";

const getNgoById = async (id) => {
  try {
    const response = await axios.get(withApiBase(`/api/ngos/${id}`));
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const addInventoryItem = async (ngoId, type, itemData) => {
  try {
    const response = await axios.post(
      withApiBase(`/api/ngos/${ngoId}/inventory/${type}`),
      itemData
    );
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const updateInventoryItem = async (ngoId, type, itemId, itemData) => {
  try {
    const response = await axios.put(
      withApiBase(`/api/ngos/${ngoId}/inventory/${type}/${itemId}`),
      itemData
    );
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const deleteInventoryItem = async (ngoId, type, itemId) => {
  try {
    const response = await axios.delete(
      withApiBase(`/api/ngos/${ngoId}/inventory/${type}/${itemId}`)
    );
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

export default {
  getNgoById,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
