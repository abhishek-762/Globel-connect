import React, { useState, useEffect } from 'react';
import { Package, PackageCategory, ItineraryItem } from '../types';

interface AddPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPackage: Omit<Package, 'id'>) => void;
    loading: boolean;
}

const initialFormData: Omit<Package, 'id'> = {
    name: '',
    destination: '',
    duration: '',
    price: 0,
    highlights: [],
    image: '',
    category: PackageCategory.ADVENTURE,
    description: '',
    itinerary: [{ day: 1, title: '', description: '' }],
};

const AddPackageModal: React.FC<AddPackageModalProps> = ({ isOpen, onClose, onSave, loading }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [highlightsText, setHighlightsText] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setHighlightsText('');
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.image.trim()) newErrors.image = 'Image is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!highlightsText.trim()) newErrors.highlightsText = 'Highlights are required';
        
        if (formData.itinerary.length > 0) {
            const dayNumbers = formData.itinerary.map(item => item.day);
            const daySet = new Set(dayNumbers);
            
            if (daySet.size !== dayNumbers.length) {
                newErrors.itinerary = 'Day numbers must be unique.';
            } else {
                const sortedDays = [...dayNumbers].sort((a, b) => a - b);
                let isSequential = true;
                for (let i = 0; i < sortedDays.length; i++) {
                    if (sortedDays[i] !== i + 1) {
                        isSequential = false;
                        break;
                    }
                }
                if (!isSequential) {
                    newErrors.itinerary = 'Day numbers must be sequential, starting from 1 (e.g., 1, 2, 3...).';
                }
            }

            let contentError = false;
            formData.itinerary.forEach((item) => {
                if (!item.title.trim() || !item.description.trim()) {
                    contentError = true;
                }
            });
            if (contentError) {
                newErrors.itinerary = (newErrors.itinerary ? newErrors.itinerary + ' ' : '') + 'Title and description are required for all itinerary days.';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleItineraryChange = (index: number, field: 'day' | 'title' | 'description', value: string) => {
        const newItinerary = [...formData.itinerary];
        const updatedItem = { ...newItinerary[index] };
        
        if (field === 'day') {
            const dayNum = parseInt(value, 10);
            updatedItem.day = isNaN(dayNum) || dayNum < 1 ? 1 : dayNum;
        } else {
            updatedItem[field] = value;
        }
        
        newItinerary[index] = updatedItem;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        const nextDay = formData.itinerary.length > 0 ? Math.max(...formData.itinerary.map(i => i.day)) + 1 : 1;
        setFormData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: nextDay, title: '', description: '' }]
        }));
    };

    const removeItineraryDay = (index: number) => {
        if (formData.itinerary.length <= 1) return;
        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const finalPackageData = {
                ...formData,
                highlights: highlightsText.split('\n').filter(h => h.trim() !== ''),
            };
            onSave(finalPackageData);
        }
    };
    
    return (
         <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={!loading ? onClose : undefined} role="dialog" aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold font-montserrat text-primary mb-6">Create New Package</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <fieldset disabled={loading} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Package Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                                <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
                            </div>
                             <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                <input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (INR)</label>
                                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Package Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/webp"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                                {formData.image && <img src={formData.image} alt="Preview" className="mt-2 rounded-md h-32 w-auto object-cover"/>}
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                             <div>
                                 <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                 <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                     {Object.values(PackageCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                 </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                             {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        
                         <div>
                            <label htmlFor="highlightsText" className="block text-sm font-medium text-gray-700">Highlights (one per line)</label>
                            <textarea name="highlightsText" id="highlightsText" rows={3} value={highlightsText} onChange={e => setHighlightsText(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                             {errors.highlightsText && <p className="text-red-500 text-xs mt-1">{errors.highlightsText}</p>}
                        </div>

                        <div className="pt-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Itinerary</h3>
                            <div className="space-y-4">
                                {formData.itinerary.map((item, index) => (
                                    <div key={index} className="p-3 border rounded-md bg-gray-50/80 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <label htmlFor={`day-${index}`} className="font-semibold text-gray-600">Day</label>
                                                <input
                                                    type="number"
                                                    id={`day-${index}`}
                                                    value={item.day}
                                                    min="1"
                                                    onChange={e => handleItineraryChange(index, 'day', e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            {formData.itinerary.length > 1 && (
                                                <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-500 hover:text-red-700">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={item.title}
                                                onChange={e => handleItineraryChange(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                rows={2}
                                                value={item.description}
                                                onChange={e => handleItineraryChange(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {errors.itinerary && <p className="text-red-500 text-xs">{errors.itinerary}</p>}
                            </div>
                             <button type="button" onClick={addItineraryDay} className="mt-3 text-sm font-semibold text-primary hover:text-primary/80">
                                + Add Day
                            </button>
                        </div>
                    </fieldset>

                    <div className="mt-6 flex justify-end space-x-4 pt-4 border-t">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors font-semibold flex items-center justify-center w-36 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                             {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Package'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackageModal;