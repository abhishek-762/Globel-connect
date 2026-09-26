import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface PackageCardProps {
    pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
    const { convertCurrency } = useCurrency();
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent navigating when clicking the share button
        e.stopPropagation();

        const shareUrl = `${window.location.origin}/#/packages/${pkg.id}`;
        const shareDetails = {
            title: pkg.name,
            text: `Check out this amazing travel package from Global Connect: ${pkg.name}`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareDetails);
            } catch (error) {
                console.error('Error sharing package:', error);
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000); // Hide message after 2 seconds
            }).catch(err => {
                console.error('Could not copy link to clipboard: ', err);
            });
        }
    };

    return (
        <Link 
            to={`/packages/${pkg.id}`} 
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
        >
            <div className="relative">
                <img src={pkg.image} alt={pkg.name} className="w-full h-56 object-cover" loading="lazy" />
                
                <button 
                    onClick={handleShare}
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-200 z-10"
                    aria-label="Share package"
                    title="Share Package"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
                </button>

                {showCopied && (
                    <div className="absolute top-4 right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-20">
                        Copied!
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm text-primary font-semibold">{pkg.duration}</span>
                <h3 className="text-xl font-bold font-poppins text-gray-800 mt-2">{pkg.name}</h3>
                <p className="text-gray-500 text-sm">{pkg.destination}</p>
                <ul className="mt-4 space-y-2 text-gray-600 text-sm list-disc list-inside flex-grow">
                    {pkg.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                    ))}
                </ul>
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-2xl font-bold text-primary">{convertCurrency(pkg.price)}</p>
                    <div className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg group-hover:bg-opacity-90 transition-colors">
                        View Details
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PackageCard;