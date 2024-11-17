import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [inputQuantity, setInputQuantity] = useState<number>(0);
  const [outputQuantity, setOutputQuantity] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      setNewProduct({ name: "", price: 0, quantity: 0 });
      fetchProducts();
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct._id, editingProduct);
      setEditingProduct(null);
      fetchProducts();
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleInput = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const updatedQuantity = product.quantity + inputQuantity;
    try {
      await updateProduct(selectedProduct, {
        ...product,
        quantity: updatedQuantity,
      });
      fetchProducts();
      setSelectedProduct("");
      setInputQuantity(0);
      toast.success("Product input successful");
    } catch (error) {
      toast.error("Failed to update product quantity");
    }
  };

  const handleOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const updatedQuantity = product.quantity - outputQuantity;
    if (updatedQuantity < 0) {
      toast.error("Cannot remove more than available quantity");
      return;
    }

    try {
      await updateProduct(selectedProduct, {
        ...product,
        quantity: updatedQuantity,
      });
      fetchProducts();
      setSelectedProduct("");
      setOutputQuantity(0);
      toast.success("Product output successful");
    } catch (error) {
      toast.error("Failed to update product quantity");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/dashboard"
        className="mb-4 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value),
              })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                quantity: parseInt(e.target.value),
              })
            }
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Input Form */}
      <form onSubmit={handleInput} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Product Input</h2>
        <div className="flex gap-2">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Input Quantity"
            value={inputQuantity}
            onChange={(e) => setInputQuantity(parseInt(e.target.value))}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Input
          </button>
        </div>
      </form>

      {/* Output Form */}
      <form onSubmit={handleOutput} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Product Output</h2>
        <div className="flex gap-2">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Output Quantity"
            value={outputQuantity}
            onChange={(e) => setOutputQuantity(parseInt(e.target.value))}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Output
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingProduct && editingProduct._id === product._id ? (
                    <>
                      <button
                        onClick={handleUpdateProduct}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
