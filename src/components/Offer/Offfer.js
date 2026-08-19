import axios from "axios";
import  { useEffect, useState } from "react";
import { Pencil, Trash } from 'lucide-react';
 
import Spin from "../utills/Spin";
import EditOffer from "./EditOffer";
import AddOffer from "./AddOffer";
import DeleteOffer from "./DeleteOffer";
import Items from "../utills/Items";



const Offer = () => {
    const [item, setItem] = useState([]);
    const [edit, setEdit] = useState(null);
    const [remove, setRemove] = useState(null);
    const [loading, setLoading] = useState(true);
    const [add, setAdd] = useState(false);
    // Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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
            const response = await fetch(`http://localhost:5000/home/search?q=${query}`);
            const data = await response.json();

            setSearchResults(data.items || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/semi-top-front/semi-front-news');
            setItem(response.data);
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



    // const dataShow = searchQuery && searchResults.length > 0 ? searchResults : item;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataShow.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataShow.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="overflow-x-auto">

            <h1 class="text-3xl font-bold text-center text-gray-800 mt-6">👋 Welcome Admin Dashboard</h1>

            {
                add && <AddOffer onClose={handleAddClose} onAdd={fetchData} />
            }
            {
                edit && <EditOffer id={edit} onClose={hanldleEditClose} onUpdate={fetchData} />
            }
            {
                remove && <DeleteOffer id={remove} onClose={handleDeleteClose} onDelete={fetchData} />
            }


            <div class="flex justify-between mt-10 mb-3">

                <Items name='Offers' />

                <div class="flex  mb-2">

                    <div onClick={handleAddItem}
                        class=" bg-white cursor-pointer me-2 flex text-center items-center justify-center rounded border border-1 border-blue-500 hover:ring-1 delay-100 transition hover:border-blue-600 px-2 w-[200px] py-1">
                        <div class="flex text-center items-center justify-center">
                            <div class="text-xs me-2">
                                ➕
                            </div>
                            <div>
                                <span class="text-gray-500">Add Items</span>
                            </div>
                        </div>

                    </div>




                    <div class="  w-full md:w-[350px]">
                        <form id="searchForm" class="flex" onsubmit="return false;">
                            <input
                                value={searchQuery}
                                onChange={handleSearch}
                                type="text" placeholder="Search assets..." class="border border-blue-500 rounded-l px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <button type="button" onclick="fetchSearchResults()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r text-sm">
                                Search
                            </button>
                        </form>
                        <div id="searchResults" class="absolute w-full bg-white shadow-md rounded mt-1 hidden z-10"></div>
                    </div>
                </div>
            </div>


            <table className="min-w-full border border-gray-300 table-fixed">
                <thead className="bg-sky-300 text-gray-800 font-normal">
                    <tr>
                        {['Image', 'Category', 'Title', 'New P', 'Old P', 'Stock', 'Color', 'Size', 'Edit', 'Delete'].map((header, index) => (
                            <th key={index} className={`px-4 py-2 ${['Title'].includes(header) ? 'w-48' : ['New P', 'Old P'].includes(header) ? 'w-28' : ['Stock'].includes(header) ? 'w-10' : ['Color', 'Size'].includes(header) ? 'w-40' : ['Edit', 'Delete'].includes(header) ? 'w-10' : 'w-24'}  ${['Image'].includes(header) ? 'text-start' : 'text-center'}`}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
                    {loading ? (

                        <tr className="min-h-[320px] w-full bg-white">
                            <td rowSpan="7" colSpan="10">
                                <div className="flex items-center justify-center min-h-[350px]">
                                    <Spin />
                                    {/* <LoadingSpin /> */}
                                </div>
                            </td>
                        </tr>

                    ) : currentItems.length > 0 ? (
                        currentItems.map((product, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 text-sm cursor-pointer transition">
                                <td className="px-2 py-1 w-24 text-start">
                                    {
                                        Array.isArray(product.img) && product.img.length > 0 ? (
                                            product.img.slice(0, 1).map((imageUrl, index) => (
                                                <img key={index} src={imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded border" />
                                            ))
                                        ) : (
                                            <span>No image available</span>
                                        )
                                    }
                                </td>
                                <td className="px-2 py-1 w-24 text-start">{product.category}</td>
                                <td className="px-2 py-1 w-48 text-start font-medium">{product.title}</td>
                                <td className="px-2 py-1 w-28 text-center font-medium">${product.newPrice}</td>
                                <td className="px-2 py-1 w-28 text-center line-through text-gray-500">${product.oldPrice}</td>
                                <td className="px-2 py-1 w-10 text-center text-gray-500">{product.stock}</td>
                                <td className="px-2 py-1 w-40 text-center">{product.color?.join(", ") || "-"}</td>
                                <td className="px-2 py-1 w-40 text-center">{product.size?.join(", ") || "-"}</td>
                                <td className="px-2 py-1 w-10 text-center gap-2">
                                    <button onClick={() => hanldleEdit(product._id)} className="bg-blue-50 hover:bg-gray-100 text-gray-400 px-4 py-2 rounded text-sm transition"><Pencil size={15} /></button>
                                </td>
                                <td className="px-2 py-1 w-10 text-center gap-2">
                                    <button onClick={() => handleDelete(product._id)} className="bg-red-50 hover:bg-gray-100 text-red-500 px-4 py-2 rounded text-sm transition"><Trash size={15} /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center py-4">No items</td>
                        </tr>
                    )}
                </tbody>

            </table>

            <div className="pagination flex justify-end space-x-2 p-4">
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
    );
};

export default Offer;
