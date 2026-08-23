import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, ChevronRight, HandCoins, LoaderCircle, ShoppingCart, Hash, CircleDollarSign, Boxes, PackageSearch } from 'lucide-react';
import Alert from '../Alert';

const getCurrencySymbol = () => {
    if (typeof document === 'undefined') {
        return '৳';
    }

    const tester = document.createElement('span');
    tester.textContent = '৳';
    return tester.textContent === '৳' ? '৳' : '$';
};

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
    const formatCurrencyValue = (value, fallback = '-') => {
        const resolvedValue = value ?? fallback;
        if (resolvedValue === '-' || resolvedValue === '') {
            return fallback;
        }

        const numericValue = Number(resolvedValue);
        const symbol = getCurrencySymbol();

        if (Number.isFinite(numericValue)) {
            return `${symbol} ${numericValue.toFixed(2)}`;
        }

        return `${symbol} ${resolvedValue}`;
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
            const response = await axios.get(`https://maruf-gadget-admin-backend.onrender.com/posts/code?q=${encodeURIComponent(trimmedCode)}`);
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
            const response = await axios.post('https://maruf-gadget-admin-backend.onrender.com/posts/sell', {
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
        <>
           {alertMessage && (
                    <Alert
                        name={alertMessage}
                        type={alertType === 'success' ? 'success' : 'error'}
                    />
                )}
        <section className="rounded-lg border border-emerald-400/15 bg-slate-900/80 p-2 shadow-lg shadow-emerald-950/20 backdrop-blur sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 sm:h-12 sm:w-12">
                    <HandCoins size={16} className="sm:hidden" />
                    <HandCoins size={20} className="hidden sm:block" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white sm:text-xl">Sell</h2>
                    <p className="hidden text-sm text-slate-400 sm:block">Enter a product code to reduce stock and save the sell record.</p>
                </div>
            </div>

            <form onSubmit={handleSellSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-start text-slate-300">
                    Product code
                    <div className="mt-2 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-950/60 focus-within:border-emerald-400/40 sm:flex-row">
                        
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter product code"
                            className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none sm:px-2"
                        />
                        <button
                            type="button"
                            disabled={lookupLoading}
                            onClick={() => lookupProduct()}
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-500/70 sm:mt-0 sm:ml-2 sm:w-auto"
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
                    <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-emerald-200">
                            <BadgeCheck size={16} />
                            <p className="text-sm font-medium">Sold item</p>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-4">
                            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                {soldItem.img ? (
                                    <img
                                        src={soldItem.img}
                                        alt={soldItem.title || 'Sold item'}
                                        className="h-44 w-full object-cover sm:h-20 sm:w-20"
                                    />
                                ) : (
                                    <div className="flex h-44 w-full items-center justify-center bg-white/5 text-slate-500 sm:h-20 sm:w-20">
                                        <PackageSearch size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2 text-sm">
                                <div className="rounded-lg bg-white/5 px-3 py-2.5">
                                    <p className="truncate font-medium text-white">{soldItem.title || '-'}</p>
                                    <p className="truncate text-xs text-slate-400">{soldItem.category || '-'}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Hash size={13} />
                                            <span>Code</span>
                                        </div>
                                        <span className="text-slate-200">{soldItem.code || '-'}</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Boxes size={13} />
                                            <span>Stock</span>
                                        </div>
                                        <span className="text-emerald-200">{soldItem.stock || '-'}</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 sm:col-span-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <CircleDollarSign size={13} />
                                            <span>Price</span>
                                        </div>
                                        <span className="text-emerald-200">{formatCurrencyValue(getDisplayPrice(soldItem.newPrice, soldItem.price))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {lookupResults.length > 0 && (
                    <label className="block text-sm font-medium text-slate-300">
                        Sell price
                        <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 focus-within:border-emerald-400/40">
                            <span className="flex items-center px-4 text-slate-500">৳</span>
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

             

                <button
                    type="submit"
                    disabled={loading || lookupResults.length === 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
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
        </>
    );
};

export default Sell;