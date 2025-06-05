import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Pencil, Trash2, PlusCircle, X } from 'lucide-react';
import clsx from 'clsx';

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/categories/getCategories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setFormName(category?.name || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setLoading(true);

    try {
      const url = selectedCategory
        ? `http://localhost:3000/api/categories/update/${selectedCategory._id}`
        : 'http://localhost:3000/api/categories/create';

      const method = selectedCategory ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim() }),
      });

      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setLoading(true);

    try {
      await fetch(`http://localhost:3000/api/categories/delete/${selectedCategory._id}`, {
        method: 'DELETE',
      });

      fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform"
        >
          <PlusCircle size={20} />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h2>
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => handleOpenModal(category)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="z-50 relative">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-800">
                {selectedCategory ? 'Edit Category' : 'Add Category'}
              </Dialog.Title>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Category Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  'w-full py-2 rounded-lg text-white font-medium',
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                )}
              >
                {selectedCategory ? 'Update' : 'Create'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="z-50 relative">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800">
              Delete Category
            </Dialog.Title>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete <strong>{selectedCategory?.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={clsx(
                  'px-4 py-2 rounded-lg text-white',
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                )}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
