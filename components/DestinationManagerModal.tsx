import React, { useState, useEffect } from 'react';
import { Destination } from '../types';

interface DestinationManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dest: { name: string; description: string; image: string }) => Promise<void>;
    destinationToEdit: Destination | null;
}

const DestinationManagerModal: React.FC<DestinationManagerModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    destinationToEdit
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (destinationToEdit) {
            setName(destinationToEdit.name);
            setDescription(destinationToEdit.description);
            setImage(destinationToEdit.image);
        } else {
            setName('');
            setDescription('');
            setImage('');
        }
        setError('');
    }, [destinationToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim() || !image.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setIsSaving(true);
            setError('');
            await onSubmit({ name: name.trim(), description: description.trim(), image: image.trim() });
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to save destination to Firestore.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold font-montserrat text-gray-900">
                        {destinationToEdit ? 'Edit Destination' : 'Add New Destination'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Destination Name *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Kashmir, India or Tokyo, Japan"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Brief summary of sights, culture, and highlights..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Cover Image URL *
                        </label>
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>

                    {image && (
                        <div className="mt-2">
                            <span className="block text-[11px] font-semibold text-gray-500 mb-1">Image Preview:</span>
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full h-36 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? 'Saving to Firestore...' : destinationToEdit ? 'Save Changes' : 'Create Destination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DestinationManagerModal;
