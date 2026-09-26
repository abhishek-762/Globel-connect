
import React from 'react';
import { Link } from 'react-router-dom';
import { Destination } from '../types';

interface DestinationCardProps {
    destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
            <div className="relative">
                <img src={destination.image} alt={destination.name} className="w-full h-56 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                     <h3 className="text-2xl font-bold text-white font-montserrat">{destination.name}</h3>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-600 mb-4">{destination.description}</p>
                <Link to="/packages" className="font-semibold text-secondary hover:text-secondary/80 transition-colors">
                    View Packages &rarr;
                </Link>
            </div>
        </div>
    );
};

export default DestinationCard;