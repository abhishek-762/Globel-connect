import React, { useState, useMemo, useEffect } from 'react';
import { usePackages } from '../contexts/PackageContext';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { Package, PackageCategory, BookingRecord } from '../types';
import EditPackageModal from '../components/EditPackageModal';
import AddPackageModal from '../components/AddPackageModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePayment } from '../contexts/PaymentContext';
import { useAuditLog } from '../contexts/AuditLogContext';

const AdminDashboard: React.FC = () => {
    const { packages, updatePackage, addPackage, deletePackage, seedInitialPackages, loading: packagesLoading } = usePackages();
    const { user, userProfile, logout } = useAuth();
    const { bookings, updateBookingStatus, updatePaymentStatus, loading: bookingsLoading } = useBookings();
    const { convertCurrency } = useCurrency();
    const { upiLink, updateUpiLink } = usePayment();
    const { logs, addLog } = useAuditLog();

    const [activeTab, setActiveTab] = useState<'packages' | 'bookings' | 'settings' | 'logs'>('packages');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookingSearchQuery, setBookingSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'All' | PackageCategory>('All');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUpiLink, setNewUpiLink] = useState(upiLink);
    const [showUpiSaved, setShowUpiSaved] = useState(false);
    const [seedSuccess, setSeedSuccess] = useState(false);

    useEffect(() => {
        setNewUpiLink(upiLink);
    }, [upiLink]);

    const handleUpiSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUpiLink(newUpiLink);
        addLog('EDIT', `Updated UPI payment link`);
        setShowUpiSaved(true);
        setTimeout(() => setShowUpiSaved(false), 3000);
    };

    const handleSeedPackages = async () => {
        if (window.confirm('Seed/restore all 10 curated travel packages to Cloud Firestore?')) {
            setIsSubmitting(true);
            await seedInitialPackages();
            await addLog('CREATE', 'Seeded initial curated packages into Firestore');
            setIsSubmitting(false);
            setSeedSuccess(true);
            setTimeout(() => setSeedSuccess(false), 4000);
        }
    };

    const filteredPackages = useMemo(() => {
        let tempPackages = packages;

        if (categoryFilter !== 'All') {
            tempPackages = tempPackages.filter(pkg => pkg.category === categoryFilter);
        }

        if (searchQuery.trim()) {
            const lowercasedQuery = searchQuery.toLowerCase();
            tempPackages = tempPackages.filter(pkg =>
                pkg.name.toLowerCase().includes(lowercasedQuery) ||
                pkg.destination.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        return [...tempPackages].sort((a, b) => a.id - b.id);
    }, [searchQuery, categoryFilter, packages]);

    const filteredBookings = useMemo(() => {
        if (!bookingSearchQuery.trim()) return bookings;
        const q = bookingSearchQuery.toLowerCase();
        return bookings.filter(b => 
            b.packageName.toLowerCase().includes(q) ||
            b.fullName.toLowerCase().includes(q) ||
            b.email.toLowerCase().includes(q) ||
            b.phone.includes(q)
        );
    }, [bookings, bookingSearchQuery]);

    const handleEditClick = (pkg: Package) => {
        setSelectedPackage(pkg);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedPackage(null);
    };

    const handleSaveChanges = async (updatedPackage: Package) => {
        setIsSubmitting(true);
        await updatePackage(updatedPackage);
        await addLog('EDIT', `Updated package: "${updatedPackage.name}" (ID: ${updatedPackage.id})`);
        setIsSubmitting(false);
        handleCloseModal();
    };
    
    const handleSaveNewPackage = async (newPackageData: Omit<Package, 'id'>) => {
        setIsSubmitting(true);
        await addPackage(newPackageData);
        await addLog('CREATE', `Created package: "${newPackageData.name}"`);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
    };

    const handleDeleteClick = (pkg: Package) => {
        setPackageToDelete(pkg);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPackageToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (packageToDelete) {
            setIsSubmitting(true);
            await deletePackage(packageToDelete.id);
            await addLog('DELETE', `Deleted package: "${packageToDelete.name}" (ID: ${packageToDelete.id})`);
            setIsSubmitting(false);
            handleCloseDeleteModal();
        }
    };

    const handleStatusChange = async (bookingId: string, status: BookingRecord['status']) => {
        await updateBookingStatus(bookingId, status);
        await addLog('STATUS_CHANGE', `Changed booking status for #${bookingId.slice(-6)} to "${status}"`);
    };

    const handlePaymentChange = async (bookingId: string, paymentStatus: BookingRecord['paymentStatus']) => {
        await updatePaymentStatus(bookingId, paymentStatus);
        await addLog('STATUS_CHANGE', `Changed payment status for #${bookingId.slice(-6)} to "${paymentStatus}"`);
    };

    const getLogColor = (action: string) => {
        switch (action) {
            case 'CREATE': return '#22c55e';
            case 'EDIT': return '#0078d7';
            case 'DELETE': return '#ef4444';
            case 'STATUS_CHANGE': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <>
            <div className="py-8 bg-gray-50 min-h-[85vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Admin Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200 gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold font-montserrat text-gray-900">Admin Dashboard</h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Firestore Connected
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Logged in as: <span className="font-semibold text-gray-800">{userProfile?.displayName || user?.email || 'admin'}</span> ({user?.email || 'System Administrator'})
                            </p>
                        </div>
                        <div className="flex items-center flex-wrap gap-3">
                            <button
                                onClick={handleSeedPackages}
                                disabled={isSubmitting}
                                className="px-3 py-2 bg-blue-50 text-primary border border-blue-200 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors"
                                title="Seed default travel packages to Firestore"
                            >
                                Seed Default Packages
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors shadow-sm"
                            >
                                + New Package
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {seedSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center justify-between">
                            <span>Curated tour packages successfully synced and verified in Cloud Firestore!</span>
                            <button onClick={() => setSeedSuccess(false)} className="text-green-600 font-bold">&times;</button>
                        </div>
                    )}

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 space-x-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('packages')}
                            className={`py-3 px-1 font-poppins text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === 'packages'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Tour Packages ({packages.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`py-3 px-1 font-poppins text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === 'bookings'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Customer Bookings ({bookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`py-3 px-1 font-poppins text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === 'settings'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Payment Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`py-3 px-1 font-poppins text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === 'logs'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Audit Logs ({logs.length})
                        </button>
                    </div>

                    {/* TAB: PACKAGES */}
                    {activeTab === 'packages' && (
                        <div>
                            <div className="bg-white shadow rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Packages</label>
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Search by name or destination..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Filter by Category</label>
                                        <select
                                            id="category"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value as 'All' | PackageCategory)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        >
                                            <option value="All">All Categories</option>
                                            {Object.values(PackageCategory).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {packagesLoading ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                        Loading packages from Firestore...
                                                    </td>
                                                </tr>
                                            ) : filteredPackages.length > 0 ? (
                                                filteredPackages.map((pkg) => (
                                                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <img className="h-10 w-10 rounded-md object-cover mr-4" src={pkg.image} alt={pkg.name} />
                                                                <div>
                                                                    <div className="text-sm font-semibold text-gray-900">{pkg.name}</div>
                                                                    <div className="text-xs text-gray-500">{pkg.destination}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-primary">
                                                                {pkg.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {pkg.duration}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {convertCurrency(pkg.price)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                            <button
                                                                onClick={() => handleEditClick(pkg)}
                                                                className="text-primary hover:text-blue-800 font-semibold"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(pkg)}
                                                                className="text-red-600 hover:text-red-800 font-semibold"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                        No packages found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: BOOKINGS */}
                    {activeTab === 'bookings' && (
                        <div>
                            <div className="bg-white shadow rounded-lg p-6 mb-6">
                                <label htmlFor="bookingSearch" className="block text-sm font-medium text-gray-700">Search Customer Bookings</label>
                                <input
                                    type="text"
                                    id="bookingSearch"
                                    placeholder="Search by package, customer name, email, or phone..."
                                    value={bookingSearchQuery}
                                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>

                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Booking / Package</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Travel Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trip Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookingsLoading ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                        Loading bookings from Firestore...
                                                    </td>
                                                </tr>
                                            ) : filteredBookings.length > 0 ? (
                                                filteredBookings.map((b) => (
                                                    <tr key={b.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-gray-900 text-sm">{b.packageName}</div>
                                                            <div className="text-xs font-mono text-gray-400">#{b.id.slice(-8)}</div>
                                                            <div className="text-xs text-gray-500">{b.travelers} Traveler(s)</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{b.fullName}</div>
                                                            <div className="text-xs text-gray-500">{b.email}</div>
                                                            <div className="text-xs text-gray-500">{b.phone}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {b.travelDate}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {convertCurrency(b.totalPrice)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={b.status}
                                                                onChange={(e) => handleStatusChange(b.id, e.target.value as BookingRecord['status'])}
                                                                className={`text-xs font-bold rounded-full px-3 py-1 border focus:outline-none ${
                                                                    b.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-300' :
                                                                    b.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                                                    b.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                                                    'bg-red-100 text-red-800 border-red-300'
                                                                }`}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Completed">Completed</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={b.paymentStatus}
                                                                onChange={(e) => handlePaymentChange(b.id, e.target.value as BookingRecord['paymentStatus'])}
                                                                className={`text-xs font-semibold rounded px-2.5 py-1 border focus:outline-none ${
                                                                    b.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                                    'bg-orange-50 text-orange-700 border-orange-300'
                                                                }`}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Paid">Paid</option>
                                                                <option value="Failed">Failed</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                        No bookings saved in Firestore yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Payment & Gateway Settings</h2>
                            <form onSubmit={handleUpiSave} className="space-y-4">
                                <div>
                                    <label htmlFor="upiLink" className="block text-sm font-medium text-gray-700">UPI Payment URI</label>
                                    <input
                                        type="text"
                                        id="upiLink"
                                        value={newUpiLink}
                                        onChange={(e) => setNewUpiLink(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-mono text-xs"
                                        placeholder="upi://pay?pa=...&pn=..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">This URI will dynamically generate QR codes for customers on the Payment page.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors shadow-sm"
                                    >
                                        Save UPI Settings
                                    </button>
                                    {showUpiSaved && (
                                        <span className="text-green-600 text-sm font-semibold">Payment link updated!</span>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB: AUDIT LOGS */}
                    {activeTab === 'logs' && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold font-poppins text-gray-800">Firestore Admin Audit Logs</h2>
                                <span className="text-xs text-gray-500 font-mono">Live stream from Firestore</span>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                                {logs.length > 0 ? (
                                    logs.map(log => (
                                        <div key={log.id} className="p-3 border-l-4 rounded-r-md bg-gray-50" style={{borderColor: getLogColor(log.action)}}>
                                            <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                                                <span className="font-semibold text-gray-800 break-all">
                                                    <span className="font-bold px-1.5 py-0.5 rounded text-xs text-white mr-1.5" style={{backgroundColor: getLogColor(log.action)}}>
                                                        {log.action}
                                                    </span>
                                                    {log.details}
                                                </span>
                                                <span className="text-gray-500 text-xs whitespace-nowrap pl-4">{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Admin: {log.adminUser}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-6">No admin actions recorded yet in Firestore.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <EditPackageModal
                pkg={selectedPackage}
                onClose={handleCloseModal}
                onSave={handleSaveChanges}
                loading={isSubmitting}
            />
            <AddPackageModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveNewPackage}
                loading={isSubmitting}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                packageName={packageToDelete?.name || ''}
                loading={isSubmitting}
            />
        </>
    );
};

export default AdminDashboard;
