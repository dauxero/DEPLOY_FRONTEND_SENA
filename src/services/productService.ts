import api from "./api";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/api/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (
  productData: Omit<Product, "_id">
): Promise<Product> => {
  try {
    const response = await api.post("/api/products", productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/products/${id}`);
  } catch (error) {
    throw error;
  }
};
