import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { userService } from './services/api';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Modal from './components/Modal';

export default function App() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await userService.createUser(userData);
      toast.success('User created successfully');
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await userService.updateUser(selectedUser._id, userData);
      toast.success('User updated successfully');
      fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.error?.message || 'Failed to delete user');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={openCreateModal}
              className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Add User
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <UserList
            users={users}
            onEdit={openEditModal}
            onDelete={handleDeleteUser}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? 'Edit User' : 'Create User'}
        >
          <UserForm
            user={selectedUser}
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}