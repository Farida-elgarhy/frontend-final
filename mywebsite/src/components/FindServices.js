import React from 'react';
import VetsList from './VetsList';
import ShopsList from './ShopsList';
import './FindServices.css';

const FindServices = () => {
    return (
        <div className="services-container">
            <div className="services-grid">
                <div className="service-section">
                    <VetsList />
                </div>
                <div className="service-section">
                    <ShopsList />
                </div>
            </div>
        </div>
    );
};

export default FindServices;
