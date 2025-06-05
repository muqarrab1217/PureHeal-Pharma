import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusCircle, X, Pencil, Trash } from 'lucide-react';
import Modal from '../components/ui/Modal'; // adjust path as needed
import Button from '../components/ui/Button'; // adjust path as needed

type User = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  created_at?: string;
  createdAt?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'cashier',
  });

  // Status modal state
  const [statusModal, setStatusModal] = useState<{ message: string; open: boolean }>({
    message: '',
    open: false,
  });

  const showStatusModal = (message: string) => {
    setStatusModal({ message, open: true });
    setTimeout(() => {
      setStatusModal({ message: '', open: false });
    }, 2500);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/getUsers');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showStatusModal('Failed to fetch users.');
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'cashier' });
    setIsOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // blank unless changing
      role: user.role,
    });
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields for creation
    if (!formData.username || !formData.email || (!editingUser && !formData.password)) {
      showStatusModal('Please fill all required fields.');
      return;
    }

    // Use registerUser API for creating new users (POST to /api/users/create)
    const endpoint = editingUser
      ? `http://localhost:3000/api/users/update/${editingUser._id}`
      : 'http://localhost:3000/api/users/register';

    const method = editingUser ? 'PUT' : 'POST';

    // Prepare payload
    const payload = {
      username: formData.username,
      email: formData.email,
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}), // send password only if present
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        setFormData({ username: '', email: '', password: '', role: 'cashier' });
        setEditingUser(null);
        await fetchUsers();
        showStatusModal(editingUser ? 'User updated successfully!' : 'User created successfully!');
      } else {
        // Try to extract error message from response
        const errorData = await res.json();
        showStatusModal(errorData.error || 'Failed to save user.');
      }
    } catch (err) {
      console.error(err);
      showStatusModal('Failed to save user.');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/remove/${userToDelete._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchUsers();
        showStatusModal('User deleted successfully!');
      } else {
        showStatusModal('Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      showStatusModal('Failed to delete user.');
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded-xl p-4 shadow bg-white relative">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-lg">{user.username}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setUserToDelete(user);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600">{user.email}</p>
            <p className="capitalize mt-1 text-sm bg-gray-100 px-2 py-1 rounded inline-block">
              {user.role}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Created:{' '}
              {new Date(user.created_at || user.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-1050">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required={!editingUser} // required if creating new user
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="cashier">Cashier</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete the user "{userToDelete?.username}"? This action cannot
          be undone.
        </p>
      </Modal>

      {/* Status Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ message: '', open: false })}
        title="Notification"
        footer={
          <div className="flex justify-end">
            <Button onClick={() => setStatusModal({ message: '', open: false })}>OK</Button>
          </div>
        }
      >
        <p className="text-gray-700">{statusModal.message}</p>
      </Modal>
    </div>
  );
}
