import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ArrowUpRight,
  Boxes,
  CalendarDays,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import Spin from './utills/Spin';

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const parseAmount = (value) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const isSameMonth = (value) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isToday = (value) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.toDateString() === now.toDateString();
};

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const possibleArrays = [
    payload.items,
    payload.data,
    payload.result,
    payload.products,
    payload.sales,
    payload.records,
    payload.posts,
  ];

  for (const item of possibleArrays) {
    if (Array.isArray(item)) return item;
  }

  if (payload.item) return [payload.item];
  if (payload.product) return [payload.product];
  if (payload.data && typeof payload.data === 'object') return [payload.data];

  return [];
};

const normalizeProducts = (items) =>
  items
    .filter((item) => item && (item.code || item.title || item.category || item.stock !== undefined || item.newPrice !== undefined))
    .map((item) => ({
      ...item,
      stock: Number(item.stock ?? 0),
      newPrice: Number(item.newPrice ?? item.price ?? 0),
    }));

const normalizeSales = (items) =>
  items
    .filter((item) => item && (item.price !== undefined || item.totalPrice !== undefined || item.amount !== undefined || item.salePrice !== undefined))
    .map((item) => ({
      ...item,
      price: parseAmount(item.price ?? item.totalPrice ?? item.amount ?? item.salePrice ?? item.newPrice),
      createdAt: item.createdAt || item.date || item.soldAt || item.updatedAt,
    }));

export default function Overview() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [simpleSell, setSimpleSell] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const productEndpoints = ['https://maruf-gadget-admin-backend.onrender.com/posts/' ];
        const salesEndpoints = ['https://maruf-gadget-admin-backend.onrender.com/posts/sell/all' ];
        const simpleSellEndpoints = ['https://maruf-gadget-admin-backend.onrender.com/posts/simple-sell/all'];

        const productRequests = await Promise.allSettled(
          productEndpoints.map((endpoint) => axios.get(endpoint))
        );

        const salesRequests = await Promise.allSettled(
          salesEndpoints.map((endpoint) => axios.get(endpoint))
        );

        const simpleSellRequests = await Promise.allSettled(
          simpleSellEndpoints.map((endpoint) => axios.get(endpoint))
        );

        const collectedProducts = productRequests.flatMap((request) => {
          if (request.status !== 'fulfilled') return [];
          return normalizeList(request.value?.data || []);
        });

        const collectedSales = salesRequests.flatMap((request) => {
          if (request.status !== 'fulfilled') return [];
          return normalizeList(request.value?.data || []);
        });

        const collectedSimpleSell = simpleSellRequests.flatMap((request) => {
          if (request.status !== 'fulfilled') return [];
          return normalizeList(request.value?.data || []);
        });

        if (!isMounted) return;

        setProducts(normalizeProducts(collectedProducts));
        setSales(normalizeSales(collectedSales));
        setSimpleSell(normalizeSales(collectedSimpleSell));
      } catch (requestError) {
        if (isMounted) {
          console.error('Failed to load overview data:', requestError);
          setError('Unable to load dashboard data right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalSale = sales.reduce((sum, item) => sum + parseAmount(item.price), 0);
    const totalSaleThisMonth = sales
      .filter((item) => isSameMonth(item.createdAt))
      .reduce((sum, item) => sum + parseAmount(item.price), 0);
    const todaySell = sales
      .filter((item) => isToday(item.createdAt))
      .reduce((sum, item) => sum + parseAmount(item.price), 0);
    const extraSellAmount = simpleSell.reduce((sum, item) => sum + parseAmount(item.price), 0);
    const thisMonthExtraSell = simpleSell
      .filter((item) => isSameMonth(item.createdAt))
      .reduce((sum, item) => sum + parseAmount(item.price), 0);
    const todayExtraSell = simpleSell
      .filter((item) => isToday(item.createdAt))
      .reduce((sum, item) => sum + parseAmount(item.price), 0);
    const stockItem = products.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
    const totalProductValue = products.reduce(
      (sum, item) => sum + (Number(item.oldPrice) || 0),
      0
    );
    const totalSellValue = products.reduce(
      (sum, item) => sum + (Number(item.newPrice) || 0),
      0
    );

    return {
      totalSale: totalSale + extraSellAmount,
      totalSaleThisMonth: totalSaleThisMonth + thisMonthExtraSell,
      todaySell: todaySell + todayExtraSell,
      extraSellAmount,
      thisMonthExtraSell,
      todayExtraSell,
      stockItem,
      totalProductValue,
      totalSellValue,
    };
  }, [sales, products, simpleSell]);

  const lowStockItems = useMemo(
    () => [...products].sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0)).slice(0, 5),
    [products]
  );

  const maxInventory = Math.max(
    ...products.map((item) => Number(item.stock) || 0),
    1
  );

  const overviewCards = [
      {
      label: 'Today Sell',
      value: formatCurrency(stats.todaySell),
      detail: 'Sales from today',
      icon: ShoppingCart,
      accent: 'from-purple-500/10 to-purple-400/5',
      iconClass: 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/30',
    },
   
    {
      label: 'This Month Sale',
      value: formatCurrency(stats.totalSaleThisMonth),
      detail: 'Current month revenue',
      icon: CalendarDays,
      accent: 'from-cyan-500/10 to-cyan-400/5',
      iconClass: 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30',
    },
     {
      label: 'Total Sale',
      value: formatCurrency(stats.totalSale),
      detail: `${sales.length} sales recorded`,
      icon: Wallet,
      accent: 'from-blue-500/10 to-blue-400/5',
      iconClass: 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30',
    },
  
    {
      label: 'Stock Item',
      value: stats.stockItem.toLocaleString(),
      detail: `${products.length} products in inventory`,
      icon: Boxes,
      accent: 'from-orange-500/10 to-orange-400/5',
      iconClass: 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-400/30',
    },
    {
      label: 'Total Product Value',
      value: formatCurrency(stats.totalProductValue),
      detail: 'Inventory value',
      icon: DollarSign,
      accent: 'from-green-500/10 to-green-400/5',
      iconClass: 'bg-green-500/20 text-green-300 ring-1 ring-green-400/30',
    },
    {
      label: 'Total Sell Value',
      value: formatCurrency(stats.totalSellValue),
      detail: 'Total sellable inventory',
      icon: TrendingUp,
      accent: 'from-indigo-500/10 to-indigo-400/5',
      iconClass: 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30',
    },
  ];

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 bg-[var(--primary-color)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 pt-10 flex flex-col gap-2.5 sm:mb-6 sm:gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">Dashboard</p>
            <h1 className="mt-1 text-xl font-bold text-white sm:mt-2 sm:text-2xl md:text-3xl">Overview</h1>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 px-2.5 py-1 text-[10px] font-medium text-blue-300 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs bg-[var(--secondary-color)]">
            <TrendingUp size={12} className="sm:block hidden" />
            <TrendingUp size={10} className="sm:hidden" />
            {loading ? 'Syncing...' : 'Live overview'}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-400/30 px-3 py-2.5 text-xs text-red-300 sm:mb-6 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm" style={{ backgroundColor: '#0A1225' }}>
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 sm:size-[18px]" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-3 grid-cols-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {overviewCards.map(({ label, value, detail, icon: Icon, accent, iconClass }) => (
            <div
              key={label}
              className={`rounded-lg border bg-gradient-to-br ${accent} p-3 shadow-[0_20px_30px_rgba(1,6,24,0.6)] backdrop-blur-sm sm:p-4 bg-[var(--secondary-color)] border-[var(--border-color)]`}
            >
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${iconClass}`}>
                  <Icon size={18} strokeWidth={2.2} className="drop-shadow-sm sm:size-5" />
                </div>
                <span className="rounded-full p-0.5 text-slate-400 sm:p-1 bg-[var(--border-color)]">
                  <ArrowUpRight size={12} strokeWidth={2.2} className="sm:size-[14px]" />
                </span>
              </div>

              <div className="mt-4 sm:mt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-xs sm:tracking-[0.16em]">{label}</p>
                {loading ? (
                  <div className="mt-3">
                    <Spin />
                  </div>
                ) : (
                  <>
                    <h2 className="mt-1.5 text-lg font-bold text-white sm:mt-3 sm:text-2xl">{value}</h2>
                    <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">{detail}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 grid gap-3 grid-cols-1 sm:gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-3 shadow-[0_20px_30px_rgba(1,6,24,0.6)] backdrop-blur-sm sm:p-4 bg-gradient-to-br from-blue-500/10 to-blue-400/5 bg-[var(--secondary-color)] border-[var(--border-color)]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30 sm:h-11 sm:w-11">
                <TrendingUp size={18} strokeWidth={2.2} className="drop-shadow-sm sm:size-5" />
              </div>
              <span className="rounded-full p-0.5 text-slate-400 sm:p-1 bg-[var(--border-color)]">
                <ArrowUpRight size={12} strokeWidth={2.2} className="sm:size-[14px]" />
              </span>
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-xs sm:tracking-[0.16em]">Total Extra Sell</p>
              {loading ? (
                <div className="mt-3">
                  <Spin />
                </div>
              ) : (
                <>
                  <h2 className="mt-1.5 text-lg font-bold text-white sm:mt-3 sm:text-2xl">{formatCurrency(stats.extraSellAmount)}</h2>
                  <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">{simpleSell.length} extra sales</p>
                </>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-3 shadow-[0_20px_30px_rgba(1,6,24,0.6)] backdrop-blur-sm sm:p-4 bg-gradient-to-br from-purple-500/10 to-purple-400/5 bg-[var(--secondary-color)] border-[var(--border-color)]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/30 sm:h-11 sm:w-11">
                <ShoppingCart size={18} strokeWidth={2.2} className="drop-shadow-sm sm:size-5" />
              </div>
              <span className="rounded-full p-0.5 text-slate-400 sm:p-1 bg-[var(--border-color)]">
                <ArrowUpRight size={12} strokeWidth={2.2} className="sm:size-[14px]" />
              </span>
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-xs sm:tracking-[0.16em]">Today Extra Sell</p>
              {loading ? (
                <div className="mt-3">
                  <Spin />
                </div>
              ) : (
                <>
                  <h2 className="mt-1.5 text-lg font-bold text-white sm:mt-3 sm:text-2xl">{formatCurrency(stats.todayExtraSell)}</h2>
                  <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">Today's extra sales</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-lg border p-4 shadow-sm sm:p-5 md:p-6 text-white bg-[var(--secondary-color)] border-[var(--border-color)]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div>
                
                <h3 className="mt-1 text-lg font-bold text-white sm:mt-2 sm:text-xl">Extra Sells</h3>
              </div>
              <div className="rounded-full p-1.5 text-blue-300 sm:p-2 bg-[var(--border-color)]">
                <ShoppingCart size={16} className="sm:size-[18px]" />
              </div>
            </div>

            <div className="mt-4 space-y-0 sm:mt-6 divide-y max-h-64 overflow-y-auto scrollbar-thin" style={{ borderColor: 'var(--border-color)' }}>
              {simpleSell.length > 0 ? (
                simpleSell.map((item, index) => (
                  <div
                    key={item._id || item.code || `extra-sell-${index}`}
                    className="flex items-center justify-between gap-3 py-3 sm:py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-500  truncate sm:text-sm">
                        {item.productName || item.title || 'Unnamed product'}
                      </p>
                    </div>
                    <span className="rounded-lg px-2.5 py-1 text-xs font-bold text-green-300 whitespace-nowrap sm:px-3 sm:py-1.5 sm:text-sm bg-[var(--border-color)]">
                      {formatCurrency(parseAmount(item.price))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-slate-500 sm:rounded-2xl sm:px-4 sm:py-8 sm:text-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-color)' }}>
                  No extra sells yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4 shadow-sm sm:p-5 md:p-6 text-white bg-[var(--secondary-color)] border-[var(--border-color)]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs sm:tracking-[0.2em]">Inventory health</p>
                <h3 className="mt-1 text-lg font-bold sm:mt-2 sm:text-xl">Low stock items</h3>
              </div>
              <div className="rounded-full p-1.5 text-orange-300 sm:p-2 bg-[var(--border-color)]">
                <Package size={16} className="sm:size-[18px]" />
              </div>
            </div>

            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => {
                  const stockLevel = Number(item.stock) || 0;
                  const fillWidth = Math.max((stockLevel / maxInventory) * 100, 12);

                  return (
                    <div key={item.code || item.title || item._id || `${item.category}-stock`}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-white truncate">{item.title || 'Unnamed product'}</p>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-orange-300 whitespace-nowrap bg-[var(--border-color)]">
                          {stockLevel}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border-color)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                          style={{ width: `${fillWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-slate-500" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-color)' }}>
                  No low stock items.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
