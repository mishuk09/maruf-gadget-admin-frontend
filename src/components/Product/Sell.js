import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, ChevronRight, HandCoins, LoaderCircle, ShoppingCart } from 'lucide-react';
import Alert from '../Alert';

const Sell = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [salePrice, setSalePrice] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [soldItem, setSoldItem] = useState(null);
    const [lookupResults, setLookupResults] = useState([]);

    const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();
    const getDisplayPrice = (itemPrice, productPrice, fallback = '-') => {
        const resolvedPrice = salePrice !== '' ? salePrice : itemPrice ?? productPrice;
        return resolvedPrice ?? fallback;
    };

    const lookupProduct = async (rawCode = code) => {
        const trimmedCode = String(rawCode ?? '').trim();

        if (!trimmedCode) {
            setAlertType('error');
            setAlertMessage('Code is required.');
            setLookupResults([]);
            setSoldItem(null);
            setSalePrice('');
            return;
        }

        setLookupLoading(true);
        setAlertMessage('');
        setAlertType('');

        try {
            const response = await axios.get(`http://localhost:5000/posts/code?q=${encodeURIComponent(trimmedCode)}`);
            const data = response?.data;

            const results = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                    ? data.items
                    : data?.item || data?.post || data?.product || data?.result || data?.data
                        ? [data.item || data.post || data.product || data.result || data.data]
                        : [];

            const filteredResults = results.filter((result) => {
                const resultCode = normalizeValue(result?.code);
                const resultTitle = normalizeValue(result?.title);
                const resultCategory = normalizeValue(result?.category);
                const query = normalizeValue(trimmedCode);

                if (resultCode) {
                    return resultCode.startsWith(query);
                }

                return [resultTitle, resultCategory].some((field) => field.includes(query));
            });

            if (filteredResults.length === 0) {
                setLookupResults([]);
                setSoldItem(null);
                setSalePrice('');
                setAlertType('error');
                setAlertMessage('No product found for that code.');
                return;
            }

            setLookupResults(filteredResults);
            setSoldItem(filteredResults[0] || null);
            setSalePrice(String(filteredResults[0]?.newPrice ?? filteredResults[0]?.price ?? ''));
            setAlertType('success');
            setAlertMessage('Product found. Submit to sell it.');
        } catch (error) {
            setLookupResults([]);
            setSoldItem(null);
            setSalePrice('');
            setAlertType('error');
            setAlertMessage('Unable to check product right now.');
            console.error('Product lookup failed:', error);
        } finally {
            setLookupLoading(false);
        }
    };

    useEffect(() => {
        const trimmedCode = String(code ?? '').trim();

        if (!trimmedCode) {
            setLookupResults([]);
            setSoldItem(null);
            setAlertMessage('');
            setAlertType('');
            return undefined;
        }

        const timer = setTimeout(() => {
            lookupProduct(trimmedCode);
        }, 350);

        return () => clearTimeout(timer);
    }, [code]);

    const handleSellSubmit = async (event) => {
        event.preventDefault();

        const trimmedCode = String(code ?? '').trim();

        if (!trimmedCode) {
            setAlertType('error');
            setAlertMessage('Code is required.');
            setSoldItem(null);
            setSalePrice('');
            return;
        }

        if (lookupResults.length === 0) {
            await lookupProduct(trimmedCode);
            return;
        }

        setLoading(true);
        setAlertMessage('');
        setAlertType('');

        try {
            const response = await axios.post('http://localhost:5000/posts/sell', {
                code: trimmedCode,
                price: salePrice === '' ? undefined : Number(salePrice),
            });

            const item = response?.data?.item || null;
            setSoldItem(item);
            setCode('');
            setLookupResults([]);
            setSalePrice('');
            setAlertType('success');
            setAlertMessage(response?.data?.message || 'Product sold successfully.');
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;

            setSoldItem(null);
            setAlertType('error');

            if (status === 400) {
                setAlertMessage(message || 'Code is required.');
            } else if (status === 404) {
                setAlertMessage(message || 'Product not found or out of stock.');
            } else {
                setAlertMessage(message || 'Unable to sell product right now.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-3xl border border-emerald-400/15 bg-slate-900/80 p-6 shadow-lg shadow-emerald-950/20 backdrop-blur">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                    <HandCoins size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Sell</h2>
                    <p className="text-sm text-slate-400">Enter a product code to reduce stock and save the sell record.</p>
                </div>
            </div>

            <form onSubmit={handleSellSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                    Product code
                    <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 focus-within:border-emerald-400/40">
                        <span className="flex items-center px-4 text-slate-500">#</span>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter product code"
                            className="w-full bg-transparent px-2 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            disabled={lookupLoading}
                            onClick={() => lookupProduct()}
                            className="inline-flex items-center gap-2 bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-500/70"
                        >
                            {lookupLoading ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    Checking
                                </>
                            ) : (
                                <>
                                    Find
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </label>

  {soldItem && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-emerald-200">
                            <BadgeCheck size={16} />
                            <p className="text-sm font-medium">Sold item</p>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr]">
                            {soldItem.img ? (
                                <img
                                    src={soldItem.img}
                                    alt={soldItem.title || 'Sold item'}
                                    className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
                                    <HandCoins size={20} />
                                </div>
                            )}

                            <div className="space-y-1 text-sm">
                                <p className="font-medium text-white">{soldItem.title || '-'}</p>
                                <p className="text-slate-400">Code: {soldItem.code || '-'}</p>
                                <p className="text-slate-400">Category: {soldItem.category || '-'}</p>
                                <p className="text-emerald-200">Price: {getDisplayPrice(soldItem.newPrice, soldItem.price)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {lookupResults.length > 0 && (
                    <label className="block text-sm font-medium text-slate-300">
                        Sell price
                        <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 focus-within:border-emerald-400/40">
                            <span className="flex items-center px-4 text-slate-500">$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                placeholder="Enter sell price"
                                className="w-full bg-transparent px-2 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                        
                    </label>
                )}

                {alertMessage && (
                    <Alert
                        name={alertMessage}
                        type={alertType === 'success' ? 'success' : 'error'}
                    />
                )}

                <button
                    type="submit"
                    disabled={loading || lookupResults.length === 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
                >
                    {loading ? (
                        <>
                            <LoaderCircle size={16} className="animate-spin" />
                            Selling
                        </>
                    ) : (
                        <>
                            Sell product
                            <ShoppingCart size={16} />
                        </>
                    )}
                </button>

              
            </form>
        </section>
    );
};

export default Sell;