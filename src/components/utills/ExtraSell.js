import React, { useState } from 'react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import Alert from '../Alert';

const ExtraSell = ({ onClose }) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName.trim()) {
            setAlertType('error');
            setAlertMessage('Product name is required.');
            return;
        }

        if (!price || Number(price) <= 0) {
            setAlertType('error');
            setAlertMessage('Please enter a valid price.');
            return;
        }

        setLoading(true);
        setAlertMessage('');
        setAlertType('');

        try {
            const response = await axios.post('https://maruf-gadget-admin-backend.onrender.com/posts/simple-sell', {
                title: productName.trim(),
                price: Number(price),
            });

            setAlertType('success');
            setAlertMessage(response?.data?.message || 'Product added successfully.');
            setProductName('');
            setPrice('');

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            const message = error?.response?.data?.message;
            setAlertType('error');
            setAlertMessage(message || 'Unable to add product right now.');
            console.error('Extra sell failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {alertMessage && (
                <Alert
                    name={alertMessage}
                    type={alertType === 'success' ? 'success' : 'error'}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-start font-medium text-slate-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-emerald-400/40 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-start font-medium text-slate-300">
                        Price
                    </label>
                    <div className="mt-2 flex rounded-lg border border-white/10 bg-slate-950/60 focus-within:border-emerald-400/40">
                        <span className="flex items-center px-4 text-slate-500">৳</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                            className="w-full bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
                >
                    {loading ? (
                        <>
                            <LoaderCircle size={16} className="animate-spin" />
                            Adding
                        </>
                    ) : (
                        'Add Product'
                    )}
                </button>
            </form>
        </>
    );
};

export default ExtraSell;
