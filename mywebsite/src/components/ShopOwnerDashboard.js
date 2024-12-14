import { useState, useEffect } from 'react';
import './ShopOwnerDashboard.css';

const ShopOwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('shop');
    const [shop, setShop] = useState({
        name: '',
        location: '',
        contactNumber: '',
        description: '',
        openingHours: ''
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchShopDetails();
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchShopDetails = async () => {
        try {
            const response = await fetch('http://localhost:8888/shop/profile', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch shop details');
            const data = await response.json();
            setShop(data);
        } catch (err) {
            setError('Failed to load shop details');
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

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8888/shop/orders', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    const handleShopUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/shop/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shop),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update shop details');
            
            setIsEditing(false);
            alert('Shop details updated successfully!');
        } catch (err) {
            setError(err.message);
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
            
            fetchProducts();
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                quantity: ''
            });
            alert('Product added successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateProduct = async (productId, updates) => {
        try {
            const response = await fetch(`http://localhost:8888/shop/products/${productId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update product');
            
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8888/shop/products/${productId}/delete`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete product');
            
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:8888/shop/orders/${orderId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update order status');
            
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="shop-dashboard-container">
            <h2>Shop Owner Dashboard</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'shop' ? 'active' : ''}
                    onClick={() => setActiveTab('shop')}
                >
                    Shop Details
                </button>
                <button 
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                <button 
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
            </div>

            {activeTab === 'shop' && (
                <div className="shop-section">
                    <div className="section-header">
                        <h3>Shop Details</h3>
                        <button 
                            className="edit-button"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Details'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form className="shop-form" onSubmit={handleShopUpdate}>
                            <div className="form-group">
                                <label>Shop Name</label>
                                <input
                                    type="text"
                                    value={shop.name}
                                    onChange={e => setShop({...shop, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={shop.location}
                                    onChange={e => setShop({...shop, location: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    value={shop.contactNumber}
                                    onChange={e => setShop({...shop, contactNumber: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={shop.description}
                                    onChange={e => setShop({...shop, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Opening Hours</label>
                                <input
                                    type="text"
                                    value={shop.openingHours}
                                    onChange={e => setShop({...shop, openingHours: e.target.value})}
                                    placeholder="e.g., Mon-Fri: 9AM-6PM"
                                    required
                                />
                            </div>
                            <button type="submit">Save Changes</button>
                        </form>
                    ) : (
                        <div className="shop-details">
                            <p><strong>Name:</strong> {shop.name}</p>
                            <p><strong>Location:</strong> {shop.location}</p>
                            <p><strong>Contact:</strong> {shop.contactNumber}</p>
                            <p><strong>Description:</strong> {shop.description}</p>
                            <p><strong>Opening Hours:</strong> {shop.openingHours}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="products-section">
                    <div className="section-header">
                        <h3>Products</h3>
                    </div>

                    <form className="add-product-form" onSubmit={handleAddProduct}>
                        <h4>Add New Product</h4>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={newProduct.quantity}
                                    onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit">Add Product</button>
                    </form>

                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>In Stock:</strong> {product.quantity}</p>
                                <div className="product-actions">
                                    <button 
                                        className="edit-button"
                                        onClick={() => {
                                            const newQuantity = prompt('Enter new quantity:');
                                            if (newQuantity) {
                                                handleUpdateProduct(product.id, { quantity: newQuantity });
                                            }
                                        }}
                                    >
                                        Update Stock
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this product?')) {
                                                handleDeleteProduct(product.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section">
                    <h3>Orders</h3>
                    <div className="orders-grid">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h4>Order #{order.id}</h4>
                                    <span className={`status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div className="order-details">
                                    <p><strong>Customer:</strong> {order.customerName}</p>
                                    <p><strong>Products:</strong></p>
                                    <ul>
                                        {order.products.map(product => (
                                            <li key={product.id}>
                                                {product.name} x{product.quantity} - ${product.price * product.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                    <p><strong>Total:</strong> ${order.total}</p>
                                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                </div>

                                {order.status === 'PENDING' && (
                                    <div className="order-actions">
                                        <button 
                                            className="confirm-button"
                                            onClick={() => handleOrderStatus(order.id, 'CONFIRMED')}
                                        >
                                            Confirm
                                        </button>
                                        <button 
                                            className="cancel-button"
                                            onClick={() => handleOrderStatus(order.id, 'CANCELLED')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {orders.length === 0 && (
                            <div className="no-orders">
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopOwnerDashboard;
