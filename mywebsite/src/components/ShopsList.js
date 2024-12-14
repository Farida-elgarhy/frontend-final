import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './ShopsList.css';

const ShopsList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedShop, setSelectedShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [purchaseMessage, setPurchaseMessage] = useState('');

    useEffect(() => {
        fetchShops();
    }, []);

    useEffect(() => {
        if (selectedShop) {
            fetchProducts(selectedShop.id);
        }
    }, [selectedShop]);

    const fetchShops = async () => {
        try {
            const response = await fetch('http://localhost:8888/shops', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok && Array.isArray(data)) {
                setShops(data);
                setError('');
            } else {
                setShops([]);
                throw new Error(data.message || 'Failed to fetch shops');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load shops. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (shopId) => {
        try {
            const response = await fetch(`http://localhost:8888/shops/${shopId}/products`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setProducts(data);
                setError('');
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load products. Please try again later.');
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchShops();
            return;
        }

        try {
            const response = await fetch(`http://localhost:8888/shops/search?name=${encodeURIComponent(searchTerm)}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok && Array.isArray(data)) {
                setShops(data);
                setError('');
            } else {
                setShops([]);
                setError('No shops found matching your search.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to search shops. Please try again later.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleShopClick = (shop) => {
        setSelectedShop(shop);
        setPurchaseMessage('');
    };

    const handlePurchase = async (productId) => {
        setPurchaseMessage('');
        try {
            console.log('Attempting purchase for product:', productId);
            const response = await fetch(`http://localhost:8888/shops/${selectedShop.id}/products/${productId}/buy`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 })
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                setPurchaseMessage('Purchase successful!');
                await fetchProducts(selectedShop.id); 
            } else {
                setPurchaseMessage(data.message || 'Failed to process purchase. Please try again.');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            setPurchaseMessage('Failed to process purchase. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading shops...</div>;
    }

    return (
        <div className="shops-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search shops..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {purchaseMessage && <div className="success-message">{purchaseMessage}</div>}

            {shops.length === 0 && !loading && !error ? (
                <div className="no-results">No shops found</div>
            ) : (
                <div className="shops-list">
                    {shops.map(shop => (
                        <div
                            key={shop.id}
                            className={`shop-card ${selectedShop?.id === shop.id ? 'selected' : ''}`}
                            onClick={() => handleShopClick(shop)}
                        >
                            <h3>{shop.name}</h3>
                            <p>Location: {shop.location}</p>
                            <p>Rating: {shop.rating}</p>
                            <p>Contact: {shop.contact}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedShop && (
                <div className="products-section">
                    <h2>Products from {selectedShop.name}</h2>
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p className="price">Price: {product.price} EGP</p>
                                <p>In Stock: {product.quantity}</p>
                                <button
                                    className="buy-button"
                                    onClick={() => handlePurchase(product.id)}
                                    disabled={product.quantity < 1}
                                >
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopsList;
