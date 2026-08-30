import axios from "axios";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Trash, Search } from 'lucide-react';
import UpdatePost from "../Post/UpdatePost";
import DeletePost from "../Post/DeletePost";
import AddPost from "../Post/AddPost";
import Spin from "../utills/Spin";
import Items from "../utills/Items";
import CodeGenerator from "../CodeGenerator";



const Home = () => {
    const [item, setItem] = useState([]);
    const [edit, setEdit] = useState(null);
    const [remove, setRemove] = useState(null);
    const [loading, setLoading] = useState(true);
    const [add, setAdd] = useState(false);
    const [revealedOldPrices, setRevealedOldPrices] = useState({});
    // Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const itemsPerPage = 7; // Number of items per page


    // Fetch search results dynamically
    const handleSearch = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setCurrentPage(1); // Reset pagination to the first page

        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`https://maruf-gadget-admin-backend.onrender.com/posts/search?q=${query}`);
            const data = await response.json();

            setSearchResults([...(data.items || [])].reverse());
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('https://maruf-gadget-admin-backend.onrender.com/posts/');
            setItem([...response.data].reverse());
            setLoading(false);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    // const dataShow = searchQuery && searchResults.length > 0 ? searchResults : item;
    const dataShow = searchQuery.length > 0 ? searchResults : item;


    const hanldleEdit = (id) => {
        setEdit(id);
    };
    const hanldleEditClose = () => {
        setEdit(null);
    };

    const handleDelete = (id) => {
        setRemove(id);
    };
    const handleDeleteClose = () => {
        setRemove(null);
    };

    const handleAddItem = () => {
        setAdd(true);
    }
    const handleAddClose = () => {
        setAdd(false)
    }

    const toggleOldPriceVisibility = (productId) => {
        setRevealedOldPrices((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    // const dataShow = searchQuery && searchResults.length > 0 ? searchResults : item;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataShow.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataShow.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatPrice = (value) => {
        const number = Number(value || 0);
        return new Intl.NumberFormat('en-US').format(number);
    };

    return (
        <div className="relative overflow-hidden h-screen rounded-lg p-4 sm:p-6 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.15),_transparent_40%)]" />
            <div className="absolute -top-40 right-10 h-96 w-96 rounded-lg bg-cyan-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-lg bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10">
            <h1 className="mt-6 text-center text-xl font-bold text-[var(--font-color)] md:text-3xl">👋 Welcome Admin Dashboard</h1>

            {
                add && <AddPost onClose={handleAddClose} onAdd={fetchData} />
            }
            {
                edit && <UpdatePost id={edit} onClose={hanldleEditClose} onUpdate={fetchData} />
            }
            {
                remove && <DeletePost id={remove} onClose={handleDeleteClose} onDelete={fetchData} />
            }


            <div className="mt-10 mb-5 flex flex-col gap-4 px-1 sm:px-2 md:flex-row md:items-center md:justify-between">
                <Items name="All Products" />
                

                <div className="flex w-full h-11 md:flex-row items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                   <CodeGenerator/>
                    {/* Add Items Button - Icon only on mobile */}
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-600 bg-[var(--secondary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--primary-color)] sm:w-auto"
                    > 
                        <span className="text-base">➕</span>
                        <span className="hidden sm:inline text-[var(--font-color)]">Add Items</span>
                    </button>

                    {/* Search Section - Hidden on mobile, visible on sm and above */}
                    <div className="hidden sm:block w-full sm:w-[320px] md:w-[360px]">
                        <form id="searchForm" className="flex w-full overflow-hidden rounded-md border border-blue-600 bg-[var(--secondary-color)]" onSubmit={(e) => e.preventDefault()}>
                            <input
                                value={searchQuery}
                                onChange={handleSearch}
                                type="text"
                                placeholder="Search assets..."
                                aria-label="Search assets"
                                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-300 outline-none"
                            />
                            <button
                                type="submit"
                                className="border-l border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                            >
                                Search
                            </button>
                        </form>
                        <div id="searchResults" className="absolute z-10 mt-1 hidden w-full max-w-[360px] rounded-md bg-white shadow-lg"></div>
                    </div>

                    {/* Mobile Search Button - Only on mobile */}
                    <button
                        type="button"
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="sm:hidden inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500"
                    >
                        <Search size={20} />
                    </button>
                </div>

                {/* Mobile Search Form - Appears on mobile when search button is clicked */}
                {showMobileSearch && (
                    <div className="sm:hidden w-full">
                        <form id="mobileSearchForm" className="flex w-full overflow-hidden rounded-md border border-blue-600 bg-[var(--secondary-color)]" onSubmit={(e) => e.preventDefault()}>
                            <input
                                value={searchQuery}
                                onChange={handleSearch}
                                type="text"
                                placeholder="Search assets..."
                                aria-label="Search assets"
                                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-300 outline-none"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="border-l border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                            >
                                <Search size={18} />
                            </button>
                        </form>
                        <div id="mobileSearchResults" className="absolute z-10 mt-1 hidden w-full rounded-md bg-white shadow-lg"></div>
                    </div>
                )}
            </div>


           <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
           <table className="max-w-auto border border-gray-300 table-fixed whitespace-nowrap">
                <thead className="bg-sky-300 text-gray-800 font-normal">
                    <tr>
                        {['Image', 'Category', 'Code', 'Title',  'Buy Price','Sell Price', 'Stock', 'Color', 'Size', 'Edit', 'Delete'].map((header, index) => (
                            <th key={index} className={`px-4 py-2 ${['Title'].includes(header) ? 'w-48' : ['Sell Price', 'Buy Price'].includes(header) ? 'w-28' : ['Stock'].includes(header) ? 'w-10' : ['Color', 'Size'].includes(header) ? 'w-40' : ['Edit', 'Delete'].includes(header) ? 'w-10' : 'w-24'}  ${['Image'].includes(header) ? 'text-start' : 'text-center'}`}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-600 text-[var(--font-color)] bg-[var(--secondary-color)] text-sm">
                    {loading ? (

                        <tr className="min-h-[320px] w-full bg-[var(--secondary-color)] text-[var(--font-color)]">
                            <td rowSpan="7" colSpan="10">
                                <div className="flex items-center justify-center min-h-[350px]">
                                    <Spin />
                                   {/* <LoadingSpin/> */}
                                </div>
                            </td>
                        </tr>

                    ) : currentItems.length > 0 ? (
                        currentItems.map((product, index) => (
                            <tr key={index} className="bg-transparent hover:bg-white/5 text-sm cursor-pointer transition">
                                <td className="px-2 py-1 w-24 text-start">
                                    {
                                        Array.isArray(product.img) && product.img.length > 0 ? (
                                            product.img.slice(0, 1).map((imageUrl, index) => (
                                                <img key={index} src={imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded  " />
                                            ))
                                        ) : (
                                            <span>No image available</span>
                                        )
                                    }



                                </td>
                                <td className="px-2 py-1 w-24 text-start">{product.category}</td>
                                <td className="px-2 py-1 w-24 text-center font-bold">{product.code}</td>
                                <td className="px-2 py-1 w-48 text-start font-medium">{product.title}</td>
                                <td className="px-2 py-1 w-28 text-center">
                                    <button
                                        type="button"
                                        onClick={() => toggleOldPriceVisibility(product._id)}
                                        className="inline-flex items-center justify-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/10 px-2 py-1 text-[11px] font-medium text-sky-200"
                                        title={revealedOldPrices[product._id] ? 'Hide buy price' : 'Show buy price'}
                                    >
                                        {revealedOldPrices[product._id] ? <EyeOff size={12} /> : <Eye size={12} />}
                                        {revealedOldPrices[product._id] ? `৳ ${formatPrice(product.oldPrice)}` : 'Show'}
                                    </button>
                                </td>
                                <td className="px-2 py-1 w-28 text-center font-medium">৳ {formatPrice(product.newPrice)}</td>
                                <td className="px-2 py-1 w-10 text-center  ">{product.stock}</td>
                                <td className="px-2 py-1 w-40 text-center">{product.color?.join(", ") || "-"}</td>
                                <td className="px-2 py-1 w-40 text-center">{product.size?.join(", ") || "-"}</td>
                                <td className="px-2 py-1 w-10 text-center gap-2">
                                    <button onClick={() => hanldleEdit(product._id)} className="bg-[var(--primary-color)] ring-1 ring-blue-500 hover:bg-[var(--secondary-color)] text-gray-400 px-4 py-2 shadow-lg shadow-blue-500/20 rounded text-sm transition"><Pencil size={15} /></button>
                                </td>
                                <td className="px-2 py-1 w-10 text-center gap-2">
                                    <button onClick={() => handleDelete(product._id)} className="bg-[var(--primary-color)] ring-1 ring-red-500 hover:bg-[var(--secondary-color)] text-red-500 px-4 py-2 rounded text-sm transition"><Trash size={15} /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center py-4">No items</td>
                        </tr>
                    )}
                </tbody>

            </table>
           </div>

            <div className="pagination flex text-[var(--font-color)] justify-end space-x-2 p-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border  shadow rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed ' : 'hover:bg-blue-100'}`}
                >
                    Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 border rounded-lg transition-colors   ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'hover:bg-blue-100'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border shadow rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                >
                    Next
                </button>
            </div>

            </div>

        </div>
    );
};

export default Home;
