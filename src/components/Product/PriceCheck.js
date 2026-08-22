import React, { useState } from 'react';
import { Search, ChevronRight, PackageSearch, AlertCircle, LoaderCircle, Eye, EyeOff, Hash, CircleDollarSign, Percent, Boxes } from 'lucide-react';

const getCurrencySymbol = () => {
    if (typeof document === 'undefined') {
        return '৳';
    }

    const tester = document.createElement('span');
    tester.textContent = '৳';
    return tester.textContent === '৳' ? '৳' : '$';
};

const PriceCheck = () => {
    const [priceQuery, setPriceQuery] = useState('');
    const [priceResults, setPriceResults] = useState([]);
    const [priceError, setPriceError] = useState('');
    const [priceLoading, setPriceLoading] = useState(false);
    const [revealedPrices, setRevealedPrices] = useState({});
    const [sellPricePercentages, setSellPricePercentages] = useState({});

    const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();

    const getStockValue = (result) => {
        const stockValue = result?.stock ?? result?.quantity ?? result?.inStock ?? result?.availableStock ?? result?.stockCount;
        return stockValue === undefined || stockValue === null || stockValue === '' ? '0' : stockValue;
    };

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
        <section className="rounded-lg border border-cyan-400/15 bg-slate-900/80 p-2 sm:p-6 shadow-lg shadow-cyan-950/20 backdrop-blur">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                    <Search size={14} />
                </div>
                <div>
                    <h2 className="text-sm sm:text-xl font-semibold text-white">Price Check</h2>
                    <p className="hidden sm:block text-sm text-slate-400">Search a product, code, or category before selling.</p>
                </div>
            </div>

            <form onSubmit={(event) => event.preventDefault()} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-start text-slate-300">
                    Search item
                    <div className="mt-2 flex flex-col sm:flex-row overflow-hidden rounded-lg border border-white/10 bg-slate-950/60 focus-within:border-cyan-400/40">
                        <input
                            type="text"
                            value={priceQuery}
                            onChange={handlePriceChange}
                            placeholder="Search by product code"
                            className="w-full bg-transparent px-4 py-3   text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            disabled={priceLoading}
                            onClick={() => handlePriceCheck(priceQuery)}
                            className="inline-flex  items-center gap-2 bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto justify-center"
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
                        <div className="rounded-lg     sm:p-4 overflow-x-auto">
                        <div className="hidden items-center gap-2 text-cyan-200 sm:flex">
                            <PackageSearch size={16} />
                            <p className="text-sm font-medium">Product found</p>
                        </div>
                        <div className=" md:mt-4 overflow-hidden rounded-lg  ">
                            <div className="hidden md:grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_0.8fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                                <div>Product</div>
                                <div className="hidden sm:block">Code</div>
                                <div className="text-right">Old Price</div>
                                <div className="text-right">New Price</div>
                                <div className="text-right">Sell Price</div>
                                <div className="text-right">Stock</div>
                            </div>
                            <div className="divide-y divide-white/10">
                                {priceResults.map((result, index) => {
                                    const stockValue = getStockValue(result);
                                    const resultKey = `${result._id || result.code || result.title || index}`;
                                    const isPriceVisible = Boolean(revealedPrices[resultKey]);
                                    const baseSellPrice = Number(result.oldPrice ?? result.price ?? result.newPrice ?? 0) || 0;
                                    const percentageValue = Number(sellPricePercentages[resultKey] ?? 0);
                                    const hasCustomPercentage = sellPricePercentages[resultKey] !== undefined && sellPricePercentages[resultKey] !== null && sellPricePercentages[resultKey] !== '';
                                    const adjustedSellPrice = hasCustomPercentage ? baseSellPrice * (1 + percentageValue / 100) : 0;

                                    const togglePriceVisibility = () => {
                                        setRevealedPrices((prev) => ({
                                            ...prev,
                                            [resultKey]: !prev[resultKey],
                                        }));
                                    };

                                    const handlePercentageChange = (event) => {
                                        const nextValue = event.target.value;
                                        setSellPricePercentages((prev) => ({
                                            ...prev,
                                            [resultKey]: nextValue,
                                        }));
                                    };

                                    const productImage = result?.img || result?.image || result?.thumbnail || result?.photo || '';

                                    return (
                                        <div key={resultKey}>
                                            <div className="grid gap-3   sm:px-4   sm:py-4 sm:hidden">
                                                <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-lg shadow-black/20">
                                                    {productImage ? (
                                                        <img
                                                            src={productImage}
                                                            alt={result.title || 'Product'}
                                                            className="h-44 w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-44 w-full items-center justify-center bg-white/5 text-slate-500">
                                                            <PackageSearch size={28} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm shadow-[0_10px_30px_rgba(2,6,23,0.25)]">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
                                                            <PackageSearch size={16} />
                                                        </div>
                                                        <div className="min-w-0 flex-1 space-y-1">
                                                            <p className="truncate text-base font-semibold text-white">{result.title || '-'}</p>
                                                            <p className="truncate text-xs text-slate-400">{result.category || '-'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 space-y-2.5">
                                                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Hash size={13} />
                                                                <span>Code</span>
                                                            </div>
                                                            <span className="text-sm text-slate-200">{result.code || '-'}</span>
                                                        </div>

                                                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <CircleDollarSign size={13} />
                                                                <span>Old Price</span>
                                                            </div>
                                                            {isPriceVisible ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={togglePriceVisibility}
                                                                    className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-200"
                                                                    aria-label="Hide price"
                                                                    title="Hide price"
                                                                >
                                                                    <EyeOff size={12} />
                                                                    {getCurrencySymbol()} {result.oldPrice ?? result.price ?? '-'}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={togglePriceVisibility}
                                                                    className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-200"
                                                                    aria-label="Show price"
                                                                    title="Show price"
                                                                >
                                                                    <Eye size={12} />
                                                                    Show
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <CircleDollarSign size={13} />
                                                                <span>New Price</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-cyan-200">
                                                                {getCurrencySymbol()} {result.newPrice ?? result.price ?? '-'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Percent size={13} />
                                                                <span>Sell Price</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-cyan-200">
                                                                {hasCustomPercentage && Number.isFinite(adjustedSellPrice) ? adjustedSellPrice.toFixed(2) : '0.00'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Boxes size={13} />
                                                                <span>Stock</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-emerald-200">{stockValue}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-2.5">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Percent size={13} />
                                                                <span className="text-xs">Adjustment</span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                min="-100"
                                                                step="0.1"
                                                                value={sellPricePercentages[resultKey] ?? 0}
                                                                onChange={handlePercentageChange}
                                                                className="ml-auto w-16 bg-transparent text-right text-xs text-white outline-none"
                                                                aria-label={`Percentage adjustment for ${result.title || 'product'}`}
                                                            />
                                                            <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hidden grid-cols-1 items-center gap-3 px-4 py-4 sm:grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr_0.8fr]">
                                                <div>
                                                    <p className="font-medium text-white">{result.title || '-'}</p>
                                                    <p className="mt-1 text-xs text-slate-400">{result.category || '-'}</p>
                                                </div>
                                                <div className="hidden text-sm text-slate-300 sm:block">{result.code || '-'}</div>
                                                <div className="flex items-center justify-end">
                                                    {isPriceVisible ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={togglePriceVisibility}
                                                                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 p-1.5 text-cyan-200 transition hover:bg-cyan-500/20"
                                                                aria-label="Hide price"
                                                                title="Hide price"
                                                            >
                                                                <EyeOff size={12} />
                                                            </button>
                                                            <div className="flex items-center gap-1 text-sm font-medium text-cyan-200">
                                                                <span aria-label="Bangladeshi Taka" title="Bangladeshi Taka">{getCurrencySymbol()}</span>
                                                                {result.oldPrice ?? result.price ?? '-'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={togglePriceVisibility}
                                                            className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-cyan-200 transition hover:bg-cyan-500/20"
                                                            aria-label="Show price"
                                                            title="Show price"
                                                        >
                                                            <Eye size={14} />
                                                            Show
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end gap-1 text-sm font-medium text-cyan-200">
                                                    <span aria-label="Bangladeshi Taka" title="Bangladeshi Taka">{getCurrencySymbol()}</span>
                                                    {result.newPrice ?? result.price ?? '-'}
                                                </div>
                                                <div className="flex items-center justify-end gap-2 text-sm font-medium text-cyan-200">
                                                    <div className="flex items-center gap-1">
                                                        <span aria-label="Bangladeshi Taka" title="Bangladeshi Taka">{getCurrencySymbol()}</span>
                                                        {hasCustomPercentage && Number.isFinite(adjustedSellPrice) ? adjustedSellPrice.toFixed(2) : '0.00'}
                                                    </div>
                                                    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-2 py-1">
                                                        <input
                                                            type="number"
                                                            min="-100"
                                                            step="0.1"
                                                            value={sellPricePercentages[resultKey] ?? 0}
                                                            onChange={handlePercentageChange}
                                                            className="w-12 bg-transparent text-right text-xs text-white outline-none"
                                                            aria-label={`Percentage adjustment for ${result.title || 'product'}`}
                                                        />
                                                        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">%</span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm font-medium text-emerald-200">{stockValue}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
};

export default PriceCheck;