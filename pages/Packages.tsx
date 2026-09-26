import React, { useState, useMemo } from 'react';
import { usePackages } from '../contexts/PackageContext';
import { Package, PackageCategory } from '../types';
import PackageCard from '../components/PackageCard';
import DestinationPreviewCard from '../components/DestinationPreviewCard';
import { getDestinationInsight } from '../data/destinationKnowledge';
import { useCurrency } from '../contexts/CurrencyContext';

const categories = [
    PackageCategory.ADVENTURE, 
    PackageCategory.FAMILY, 
    PackageCategory.HONEYMOON, 
    PackageCategory.CULTURAL
];

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

const popularSearches = [
    'Varanasi',
    'Bali',
    'Dubai',
    'Maldives',
    'Switzerland',
    'Ladakh',
    'Paris',
    'Kyoto'
];

const Packages: React.FC = () => {
    const { packages, loading } = usePackages();
    const { convertCurrency } = useCurrency();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'All'>('All');
    const [selectedDestination, setSelectedDestination] = useState<string>('All');
    const [sortBy, setSortBy] = useState<SortOption>('recommended');

    // Calculate dynamic price boundaries from packages
    const { minPossiblePrice, maxPossiblePrice } = useMemo(() => {
        if (!packages || packages.length === 0) {
            return { minPossiblePrice: 0, maxPossiblePrice: 500000 };
        }
        const prices = packages.map(p => p.price);
        return {
            minPossiblePrice: Math.min(...prices),
            maxPossiblePrice: Math.max(...prices),
        };
    }, [packages]);

    const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

    // Dynamic distinct destinations list
    const destinationsList = useMemo(() => {
        const dests = Array.from(new Set(packages.map(p => p.destination))).filter(Boolean);
        return dests.sort();
    }, [packages]);

    // Active price cutoff
    const currentPriceCap = maxPriceFilter !== null ? maxPriceFilter : maxPossiblePrice;

    // Filtered and sorted packages
    const filteredPackages = useMemo(() => {
        let list = [...packages];

        // 1. Search Query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(pkg =>
                pkg.name.toLowerCase().includes(query) ||
                pkg.destination.toLowerCase().includes(query) ||
                pkg.description.toLowerCase().includes(query) ||
                pkg.category.toLowerCase().includes(query) ||
                pkg.highlights.some(h => h.toLowerCase().includes(query))
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'All') {
            list = list.filter(pkg => pkg.category === selectedCategory);
        }

        // 3. Destination Filter
        if (selectedDestination !== 'All') {
            list = list.filter(pkg => pkg.destination.toLowerCase() === selectedDestination.toLowerCase());
        }

        // 4. Price Filter
        if (maxPriceFilter !== null) {
            list = list.filter(pkg => pkg.price <= maxPriceFilter);
        }

        // 5. Sorting
        list.sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'duration-asc') {
                const daysA = parseInt(a.duration) || 0;
                const daysB = parseInt(b.duration) || 0;
                return daysA - daysB;
            }
            if (sortBy === 'duration-desc') {
                const daysA = parseInt(a.duration) || 0;
                const daysB = parseInt(b.duration) || 0;
                return daysB - daysA;
            }
            return a.id - b.id; // Default recommended
        });

        return list;
    }, [packages, searchQuery, selectedCategory, selectedDestination, maxPriceFilter, sortBy]);

    // Intelligent fallback resolver for uncataloged places
    const destinationInsight = useMemo(() => {
        if (searchQuery.trim() !== '' && filteredPackages.length === 0) {
            return getDestinationInsight(searchQuery);
        }
        return null;
    }, [searchQuery, filteredPackages.length]);

    // Similar packages based on matched category or closest budget
    const similarPackages = useMemo(() => {
        if (!destinationInsight) return [];
        return [...packages]
            .sort((a, b) => {
                const catMatchA = a.category.toLowerCase() === destinationInsight.category.toLowerCase() ? 1 : 0;
                const catMatchB = b.category.toLowerCase() === destinationInsight.category.toLowerCase() ? 1 : 0;
                if (catMatchA !== catMatchB) return catMatchB - catMatchA;
                return Math.abs(a.price - destinationInsight.estimatedPrice) - Math.abs(b.price - destinationInsight.estimatedPrice);
            })
            .slice(0, 3);
    }, [destinationInsight, packages]);

    const isFiltered = Boolean(
        searchQuery.trim() !== '' ||
        selectedCategory !== 'All' ||
        selectedDestination !== 'All' ||
        maxPriceFilter !== null ||
        sortBy !== 'recommended'
    );

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedDestination('All');
        setMaxPriceFilter(null);
        setSortBy('recommended');
    };

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="text-xs uppercase font-bold tracking-widest text-secondary block mb-2 font-poppins">
                        Curated Travel Experiences
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-montserrat text-gray-900 tracking-tight">
                        Find Your Perfect Tour Package
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 font-poppins">
                        Explore handpicked vacation escapes, cultural journeys, and thrilling adventures around the globe.
                    </p>
                </div>

                {/* Filter and Search Hub */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10 transition-all">
                    {/* Top Row: Search Bar */}
                    <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by package name, destination, city, or activity (e.g. Varanasi, Paris, temple, cruise)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                                title="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Popular Quick-Search Suggestions */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-6 text-xs text-gray-500">
                        <span className="font-semibold text-gray-600">Quick Search:</span>
                        {popularSearches.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className={`px-2.5 py-1 rounded-full border transition-all ${
                                    searchQuery.toLowerCase() === tag.toLowerCase()
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Middle Row: Category Filter Tabs */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-poppins">
                            Filter by Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                    selectedCategory === 'All'
                                        ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Packages ({packages.length})
                            </button>
                            {categories.map((cat) => {
                                const count = packages.filter(p => p.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Row: Destination Dropdown, Max Price Slider, Sorting Dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                        {/* Destination Dropdown */}
                        <div>
                            <label htmlFor="destination-select" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-poppins">
                                Destination
                            </label>
                            <div className="relative">
                                <select
                                    id="destination-select"
                                    value={selectedDestination}
                                    onChange={(e) => setSelectedDestination(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                                >
                                    <option value="All">All Destinations ({destinationsList.length})</option>
                                    {destinationsList.map((dest) => (
                                        <option key={dest} value={dest}>
                                            {dest}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="price-slider" className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins">
                                    Max Budget
                                </label>
                                <span className="text-sm font-bold text-primary font-poppins">
                                    {convertCurrency(currentPriceCap)}
                                </span>
                            </div>
                            <input
                                id="price-slider"
                                type="range"
                                min={minPossiblePrice}
                                max={maxPossiblePrice}
                                step={5000}
                                value={currentPriceCap}
                                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                            />
                            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                                <span>Min: {convertCurrency(minPossiblePrice)}</span>
                                <span>Max: {convertCurrency(maxPossiblePrice)}</span>
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div>
                            <label htmlFor="sort-select" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-poppins">
                                Sort Results
                            </label>
                            <div className="relative">
                                <select
                                    id="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                                >
                                    <option value="recommended">Recommended & Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="duration-asc">Duration: Shortest to Longest</option>
                                    <option value="duration-desc">Duration: Longest to Shortest</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Summary Bar */}
                    {isFiltered && (
                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-gray-500">Active Filters:</span>
                                {searchQuery && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-primary font-medium">
                                        Keyword: "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
                                    </span>
                                )}
                                {selectedCategory !== 'All' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-primary font-medium">
                                        Category: {selectedCategory}
                                        <button onClick={() => setSelectedCategory('All')} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
                                    </span>
                                )}
                                {selectedDestination !== 'All' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-primary font-medium">
                                        Destination: {selectedDestination}
                                        <button onClick={() => setSelectedDestination('All')} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
                                    </span>
                                )}
                                {maxPriceFilter !== null && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-primary font-medium">
                                        Under {convertCurrency(maxPriceFilter)}
                                        <button onClick={() => setMaxPriceFilter(null)} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
                                    </span>
                                )}
                                {sortBy !== 'recommended' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-primary font-medium">
                                        Sorted
                                        <button onClick={() => setSortBy('recommended')} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleResetFilters}
                                className="text-red-600 hover:text-red-700 font-semibold hover:underline flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Header (when results exist) */}
                {filteredPackages.length > 0 && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm font-semibold text-gray-700">
                            Showing <span className="text-primary font-bold">{filteredPackages.length}</span> of {packages.length} tour packages
                        </p>
                    </div>
                )}

                {/* Packages Grid or Intelligent Destination Fallback */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.map((pkg: Package) => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                ) : destinationInsight ? (
                    /* Smart destination preview fallback when place is searched */
                    <DestinationPreviewCard
                        searchQuery={searchQuery}
                        insight={destinationInsight}
                        similarPackages={similarPackages}
                        onResetFilters={handleResetFilters}
                    />
                ) : (
                    /* Generic empty state if purely constrained by filter sliders */
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto p-8">
                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">No matching packages found</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            We couldn't find any tour packages matching your current filter limits. Try increasing your budget slider or resetting category filters.
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;
