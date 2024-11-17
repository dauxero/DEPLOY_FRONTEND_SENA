import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

interface User {
  _id: string;
  email: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "Normal User",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ email: "", password: "", role: "Normal User" });
      fetchUsers();
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser(editingUser._id, {
        email: editingUser.email,
        role: editingUser.role,
      });
      setEditingUser(null);
      fetchUsers();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
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
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <form onSubmit={handleAddUser} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Normal User">Normal User</option>
            <option value="Administrator">Administrator</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUser && editingUser._id === user._id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      className="border p-1 rounded"
                    >
                      <option value="Normal User">Normal User</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <button
                        onClick={handleUpdateUser}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
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

export default Users;
