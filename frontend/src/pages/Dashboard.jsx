import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios.js';
import { Search, RotateCcw, Plus, Edit2, Trash2, Check, X, PackagePlus, ShoppingBag, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);
    const [showRestockForm, setShowRestockForm] = useState(null);
    const [purchasing, setPurchasing] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity_in_stock: '',
    });

    const [restockQuantity, setRestockQuantity] = useState('');

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sweets/');
            setSweets(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load sweets. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchName) params.append('name', searchName);
            if (searchCategory) params.append('category', searchCategory);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);

            const response = await api.get(`/sweets/search?${params.toString()}`);
            setSweets(response.data);
            setError('');
        } catch (err) {
            setError('Search failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchName('');
        setSearchCategory('');
        setMinPrice('');
        setMaxPrice('');
        fetchSweets();
    };

    const handlePurchase = async (sweetId) => {
        try {
            setPurchasing({ ...purchasing, [sweetId]: true });
            await api.post(`/sweets/${sweetId}/purchase`, { quantity: 1 });
            await fetchSweets();
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Purchase failed. Please try again.');
        } finally {
            setPurchasing({ ...purchasing, [sweetId]: false });
        }
    };

    const handleAddSweet = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets/', formData);
            setShowAddForm(false);
            setFormData({ name: '', category: '', price: '', quantity_in_stock: '' });
            await fetchSweets();
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || 'Failed to add sweet.');
        }
    };

    const handleUpdateSweet = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/sweets/${editingSweet.id}/`, formData);
            setEditingSweet(null);
            setFormData({ name: '', category: '', price: '', quantity_in_stock: '' });
            await fetchSweets();
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || 'Failed to update sweet.');
        }
    };

    const handleDeleteSweet = async (sweetId) => {
        if (!window.confirm('Are you sure you want to delete this sweet?')) return;
        try {
            await api.delete(`/sweets/${sweetId}/`);
            await fetchSweets();
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete sweet.');
        }
    };

    const handleRestock = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/sweets/${showRestockForm}/restock`, { quantity: parseInt(restockQuantity) });
            setShowRestockForm(null);
            setRestockQuantity('');
            await fetchSweets();
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to restock sweet.');
        }
    };

    const startEdit = (sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity_in_stock: sweet.quantity_in_stock,
        });
    };

    const cancelEdit = () => {
        setEditingSweet(null);
        setFormData({ name: '', category: '', price: '', quantity_in_stock: '' });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.is_staff || user?.is_superuser;

    return (
        <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
            <nav className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-light tracking-wide text-white">Sweet Shop</h1>
                <div className="flex items-center gap-4">
                    <span className="text-white">Welcome, {user?.username}</span>
                    {isAdmin && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Admin</span>}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="p-2 border bg-white rounded-lg hover:bg-zinc-200 cursor-pointer transition-colors text-zinc-900"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto">
                {error && (
                    <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-800">
                        {error}
                    </div>
                )}

                <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="flex-1 p-3 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Category..."
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className="flex-1 p-3 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-gray-500"
                        />
                        <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-32 p-3 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-gray-500"
                        />
                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-32 p-3 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-gray-500"
                        />
                        <button
                            onClick={handleSearch}
                            title="Search"
                            className="p-3 bg-zinc-100 text-zinc-950 rounded-lg cursor-pointer hover:bg-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleReset}
                            title="Reset"
                            className="p-3 border cursor-pointer border-zinc-700 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isAdmin && (
                    <div className="mb-6">
                        {!showAddForm && !editingSweet && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                title="Add New Sweet"
                                className="p-3 bg-green-600 cursor-pointer text-white rounded-full shadow-lg hover:bg-green-700 transition-colors fixed bottom-8 right-8 md:static md:rounded-lg md:shadow-none md:w-auto md:h-auto md:px-6 md:py-3 flex items-center gap-2"
                            >
                                <Plus className="w-6 h-6 md:w-5 md:h-5" />
                                <span className="hidden md:inline">Add Sweet</span>
                            </button>
                        )}
                        {showAddForm && (
                            <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6">
                                <h2 className="text-xl font-medium mb-4 text-white">Add New Sweet</h2>
                                <form onSubmit={handleAddSweet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantity in Stock"
                                        value={formData.quantity_in_stock}
                                        onChange={(e) => setFormData({ ...formData, quantity_in_stock: e.target.value })}
                                        className="p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500"
                                        required
                                    />
                                    <div className="md:col-span-2 flex gap-4">
                                        <button
                                            type="submit"
                                            title="Save"
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setFormData({ name: '', category: '', price: '', quantity_in_stock: '' });
                                            }}
                                            title="Cancel"
                                            className="px-6 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-zinc-500">Loading sweets...</div>
                ) : sweets.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-zinc-500">No sweets found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sweets.map((sweet) => (
                            <div key={sweet.id} className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6 hover:shadow-md transition-shadow">
                                {editingSweet?.id === sweet.id ? (
                                    <form onSubmit={handleUpdateSweet} className="space-y-4">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={formData.quantity_in_stock}
                                            onChange={(e) => setFormData({ ...formData, quantity_in_stock: e.target.value })}
                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                title="Save"
                                                className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                title="Cancel"
                                                className="flex-1 p-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-medium text-white mb-2">{sweet.name}</h3>
                                        <p className="text-zinc-400 mb-2">Category: {sweet.category}</p>
                                        <p className="text-lg font-semibold text-white mb-2">Rs {parseFloat(sweet.price).toFixed(2)}</p>
                                        <p className={`text-sm mb-4 ${sweet.quantity_in_stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            Stock: {sweet.quantity_in_stock}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handlePurchase(sweet.id)}
                                                disabled={sweet.quantity_in_stock === 0 || purchasing[sweet.id]}
                                                className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${sweet.quantity_in_stock === 0
                                                        ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                                                    }`}
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                {purchasing[sweet.id] ? '...' : 'Purchase'}
                                            </button>
                                            {isAdmin && (
                                                <>
                                                    {showRestockForm === sweet.id ? (
                                                        <form onSubmit={handleRestock} className="flex gap-2">
                                                            <input
                                                                type="number"
                                                                placeholder="Qty"
                                                                value={restockQuantity}
                                                                onChange={(e) => setRestockQuantity(e.target.value)}
                                                                className="flex-1 p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
                                                                required
                                                            />
                                                            <button
                                                                type="submit"
                                                                title="Add Stock"
                                                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRestockForm(null);
                                                                    setRestockQuantity('');
                                                                }}
                                                                title="Cancel"
                                                                className="p-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEdit(sweet)}
                                                                title="Edit"
                                                                className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowRestockForm(sweet.id)}
                                                                title="Restock"
                                                                className="flex-1 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                                                            >
                                                                <PackagePlus className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSweet(sweet.id)}
                                                                title="Delete"
                                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
