import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopDashboard.css';

const ShopDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: '',
        location: '',
        description: '',
        contactNumber: '',
        openingHours: '',
        services: ''
    });
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchProducts();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8888/shop/profile', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8888/shop/products', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/shop/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update profile');
            
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your shop profile? This action cannot be undone.')) {
            try {
                const response = await fetch('http://localhost:8888/shop/profile/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to delete profile');
                
                alert('Profile deleted successfully!');
                navigate('/');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/shop/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to add product');

            await fetchProducts();
            setIsAddingProduct(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: ''
            });
            alert('Product added successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8888/shop/products/${editingProduct.id}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update product');

            await fetchProducts();
            setEditingProduct(null);
            alert('Product updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:8888/shop/products/${productId}/delete`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to delete product');

                await fetchProducts();
                alert('Product deleted successfully!');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="shop-dashboard-container">
            <h2>Shop Dashboard</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'profile' ? 'active' : ''}
                    onClick={() => setActiveTab('profile')}
                >
                    Shop Profile
                </button>
                <button 
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="profile-section">
                    <div className="section-header">
                        <h3>Shop Profile</h3>
                        <div className="profile-actions">
                            <button 
                                className="edit-button"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                            <button 
                                className="delete-button"
                                onClick={handleDeleteProfile}
                            >
                                Delete Profile
                            </button>
                        </div>
                    </div>

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Shop Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={e => setProfile({...profile, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={e => setProfile({...profile, location: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={profile.description}
                                    onChange={e => setProfile({...profile, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    value={profile.contactNumber}
                                    onChange={e => setProfile({...profile, contactNumber: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Opening Hours</label>
                                <textarea
                                    value={profile.openingHours}
                                    onChange={e => setProfile({...profile, openingHours: e.target.value})}
                                    placeholder="e.g., Mon-Fri: 9AM-6PM"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Services</label>
                                <textarea
                                    value={profile.services}
                                    onChange={e => setProfile({...profile, services: e.target.value})}
                                    placeholder="e.g., Grooming, Pet Food, Accessories"
                                    required
                                />
                            </div>
                            <button type="submit" className="save-button">Save Changes</button>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <p><strong>Shop Name:</strong> {profile.name}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Description:</strong> {profile.description}</p>
                            <p><strong>Contact:</strong> {profile.contactNumber}</p>
                            <p><strong>Opening Hours:</strong> {profile.openingHours}</p>
                            <p><strong>Services:</strong> {profile.services}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="products-section">
                    <div className="section-header">
                        <h3>Products</h3>
                        <button 
                            className="add-button"
                            onClick={() => setIsAddingProduct(true)}
                        >
                            Add New Product
                        </button>
                    </div>

                    {isAddingProduct && (
                        <form className="product-form" onSubmit={handleAddProduct}>
                            <h4>Add New Product</h4>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-button">Add Product</button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setIsAddingProduct(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                {editingProduct?.id === product.id ? (
                                    <form className="product-form" onSubmit={handleUpdateProduct}>
                                        <div className="form-group">
                                            <label>Product Name</label>
                                            <input
                                                type="text"
                                                value={editingProduct.name}
                                                onChange={e => setEditingProduct({
                                                    ...editingProduct,
                                                    name: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={editingProduct.description}
                                                onChange={e => setEditingProduct({
                                                    ...editingProduct,
                                                    description: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                value={editingProduct.price}
                                                onChange={e => setEditingProduct({
                                                    ...editingProduct,
                                                    price: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Stock</label>
                                            <input
                                                type="number"
                                                value={editingProduct.stock}
                                                onChange={e => setEditingProduct({
                                                    ...editingProduct,
                                                    stock: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Category</label>
                                            <input
                                                type="text"
                                                value={editingProduct.category}
                                                onChange={e => setEditingProduct({
                                                    ...editingProduct,
                                                    category: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="save-button">Save Changes</button>
                                            <button 
                                                type="button" 
                                                className="cancel-button"
                                                onClick={() => setEditingProduct(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="product-header">
                                            <h4>{product.name}</h4>
                                            <div className="product-actions">
                                                <button 
                                                    className="edit-button"
                                                    onClick={() => setEditingProduct(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-button"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="product-details">
                                            <p><strong>Description:</strong> {product.description}</p>
                                            <p><strong>Price:</strong> ${product.price}</p>
                                            <p><strong>Stock:</strong> {product.stock}</p>
                                            <p><strong>Category:</strong> {product.category}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="no-products">
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDashboard;
