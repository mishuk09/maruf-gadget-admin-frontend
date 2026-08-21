import React, { useState } from 'react';
import { Search, ChevronRight, PackageSearch, IndianRupee, AlertCircle, LoaderCircle } from 'lucide-react';

const PriceCheck = () => {
    const [priceQuery, setPriceQuery] = useState('');
    const [priceResults, setPriceResults] = useState([]);
    const [priceError, setPriceError] = useState('');
    const [priceLoading, setPriceLoading] = useState(false);

    const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();

    const filterPriceResults = (results, query) => {
        const normalizedQuery = normalizeValue(query);

        if (!normalizedQuery) {
            return [];
        }

        return results.filter((result) => {
            const code = normalizeValue(result?.code);
            const title = normalizeValue(result?.title);
            const category = normalizeValue(result?.category);

            if (code) {
                return code.startsWith(normalizedQuery);
            }

            return [title, category].some((field) => field.includes(normalizedQuery));
        });
    };

    const handlePriceCheck = async (queryValue) => {
        const query = queryValue.trim();

        if (!query) {
            setPriceResults([]);
            setPriceError('');
            setPriceLoading(false);
            return;
        }

        setPriceLoading(true);
        setPriceError('');

        try {
            const response = await fetch(`http://localhost:5000/posts/code?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            const results = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                    ? data.items
                    : data?.item || data?.post || data?.product || data?.result || data?.data
                        ? [data.item || data.post || data.product || data.result || data.data]
                        : [];

            const filteredResults = filterPriceResults(results, query);

            if (filteredResults.length === 0) {
                setPriceResults([]);
                setPriceError('No product found for that search.');
                return;
            }

            setPriceResults(filteredResults);
        } catch (error) {
            console.error('Price check failed:', error);
            setPriceResults([]);
            setPriceError('Unable to check price right now.');
        } finally {
            setPriceLoading(false);
        }
    };

    const handlePriceChange = (event) => {
        const query = event.target.value;
        setPriceQuery(query);

        if (query.trim() === '') {
            setPriceResults([]);
            setPriceError('');
            setPriceLoading(false);
            return;
        }

        handlePriceCheck(query);
    };

    return (
        <section className="rounded-3xl border border-cyan-400/15 bg-slate-900/80 p-6 shadow-lg shadow-cyan-950/20 backdrop-blur">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                    <Search size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Price Check</h2>
                    <p className="text-sm text-slate-400">Search a product, code, or category before selling.</p>
                </div>
            </div>

            <form onSubmit={(event) => event.preventDefault()} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                    Search item
                    <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 focus-within:border-cyan-400/40">
                        <input
                            type="text"
                            value={priceQuery}
                            onChange={handlePriceChange}
                            placeholder="Search by product name or code"
                            className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            disabled={priceLoading}
                            onClick={() => handlePriceCheck(priceQuery)}
                            className="inline-flex items-center gap-2 bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {priceLoading ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    Checking
                                </>
                            ) : (
                                <>
                                    Check
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </label>

                {priceError && (
                    <div className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        <AlertCircle size={16} />
                        {priceError}
                    </div>
                )}

                {priceResults.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-cyan-200">
                            <PackageSearch size={16} />
                            <p className="text-sm font-medium">Product found</p>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                            <div className="grid grid-cols-2 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400 sm:grid-cols-[1.6fr_1fr_1fr]">
                                <div>Product</div>
                                <div className="hidden sm:block">Code</div>
                                <div className="text-right">Price</div>
                            </div>
                            <div className="divide-y divide-white/10">
                                {priceResults.map((result, index) => (
                                    <div key={`${result._id || result.code || index}`} className="grid grid-cols-2 items-center gap-3 px-4 py-4 sm:grid-cols-[1.6fr_1fr_1fr]">
                                        <div>
                                            <p className="font-medium text-white">{result.title || '-'}</p>
                                            <p className="mt-1 text-xs text-slate-400">{result.category || '-'}</p>
                                        </div>
                                        <div className="hidden text-sm text-slate-300 sm:block">{result.code || '-'}</div>
                                        <div className="flex items-center justify-end gap-1 text-sm font-medium text-cyan-200">
                                            <IndianRupee size={14} />
                                            {result.newPrice ?? result.price ?? '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
};

export default PriceCheck;