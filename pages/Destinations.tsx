import React, { useState, useMemo } from 'react';
import { destinations } from '../constants';
import DestinationCard from '../components/DestinationCard';
import { Destination } from '../types';

const Destinations: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState<'All' | 'India' | 'Outside India'>('All');

    const filteredDestinations = useMemo(() => {
        let tempDestinations = destinations;

        // Filter by region
        if (regionFilter === 'India') {
            tempDestinations = tempDestinations.filter(d => d.name.toLowerCase().includes('india'));
        } else if (regionFilter === 'Outside India') {
            tempDestinations = tempDestinations.filter(d => !d.name.toLowerCase().includes('india'));
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            tempDestinations = tempDestinations.filter(
                (destination) =>
                    destination.name.toLowerCase().includes(lowercasedQuery) ||
                    destination.description.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        return tempDestinations;
    }, [searchQuery, regionFilter]);

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">Our Destinations</h1>
                    <p className="mt-4 text-lg text-gray-600">Discover the world with us. Choose your next adventure.</p>
                </div>

                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setRegionFilter('All')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${regionFilter === 'All' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setRegionFilter('India')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${regionFilter === 'India' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        India
                    </button>
                    <button
                        onClick={() => setRegionFilter('Outside India')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${regionFilter === 'Outside India' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Outside India
                    </button>
                </div>

                <div className="max-w-xl mx-auto mb-12">
                     <input
                        type="search"
                        placeholder="Search for a destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    />
                </div>
                
                {filteredDestinations.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDestinations.map((destination: Destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500">No destinations found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;