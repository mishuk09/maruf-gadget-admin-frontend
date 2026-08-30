import   { useState, useEffect } from 'react';
import axios from 'axios';
import {   Check, Download } from 'lucide-react';

import * as XLSX from 'xlsx';
import Spin from '../utills/Spin';
import LoadingSpin from '../utills/LoadingSpin';
import Alert from '../Alert';
import Items from '../utills/Items';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrderId, setLoadingOrderId] = useState(null);
    // const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const handleSearch = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setCurrentPage(1); // Reset pagination to the first page

        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`https://maruf-gadget-admin-backend.onrender.com/item/search?q=${query}`);
            const data = await response.json();

            setSearchResults(data.items || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://maruf-gadget-admin-backend.onrender.com/item/orders')
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    window.location.href = '/signin';
                } else {
                    // setError(error.message);
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, []);

    const handleCompleteOrder = async (orderId) => {
        setLoadingOrderId(orderId);
        try {
            await axios.delete(`https://maruf-gadget-admin-backend.onrender.com/item/orders/${orderId}`)

            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error('Error completing order:', error);
        } finally {
            setLoadingOrderId(false);
        }
    };

    const exportToExcel = () => {
        if (orders.length === 0) {
            alert('No orders to export!');
            return;
        }

        const formattedOrders = orders.map((order) => ({
            'Full Name': order.fullName,
            'Email': order.email,
            'Phone': order.phoneNumber,
            'City': order.city,
            'Address': order.address,
            'Order Note': order.orderNote,
            'Total Amount ($)': order.totalAmount,
            'Items': order.cartItems.map(item =>
                `Title: ${item.title}, Color: ${item.color}, Size: ${item.size}, Quantity: ${item.quantity}, Price: ${item.price}`
            ).join('; ')
        }));

        const ws = XLSX.utils.json_to_sheet(formattedOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'Orders_Report.xlsx');
    };


    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const dataShow = searchQuery.length > 0 ? searchResults : orders;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataShow.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataShow.length / itemsPerPage);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="overflow-x-auto">
            {
                loadingOrderId && (
                    <Alert name="Order completed..." />
                )
            }
            <h1 class="text-3xl font-bold text-center text-gray-800 mt-6">👋 Welcome Order's Dashboard</h1>

            <div class="flex justify-between mt-10 mb-3">
                <Items name='Orders' />

                <div class="flex  mb-2">

                    <div
                        class=" bg-white cursor-pointer me-2 flex text-center items-center justify-center rounded border border-1 border-blue-500 hover:ring-1 delay-100 transition hover:border-blue-600 px-2 w-[200px] py-1">
                        <div onClick={exportToExcel} class="flex text-center items-center justify-center">
                            <div class="text-xs me-2">
                                <Download size={18} className='text-gray-600' />
                            </div>
                            <div>
                                <span class="text-gray-500">Download Excel</span>
                            </div>
                        </div>

                    </div >




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
                </div >
            </div >

            <table className="min-w-full border border-gray-300 table-fixed">
                <thead className='bg-sky-300 text-gray-800 font-normal'>
                    <tr className=" ">
                        <th className="px-4 py-2 border">Sr No</th>
                        <th className="px-4 py-2 border">Full Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Phone</th>
                        <th className="px-4 py-2 border">City</th>
                        <th className="px-4 py-2 border">Total Amount</th>
                        <th className="px-4 py-2 border">Payment</th>
                        <th className="px-4 py-2 border">Items</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? (
                            <tr className="min-h-[320px] w-full bg-white">
                                <td rowSpan="7" colSpan="10">
                                    <div className="flex items-center justify-center min-h-[350px]">
                                        <Spin />

                                    </div>
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((order, index) => (
                                <tr key={order._id} className="text-center bg-white">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{order.fullName}</td>
                                    <td className="px-4 py-2 border">{order.email}</td>
                                    <td className="px-4 py-2 border">{order.phoneNumber}</td>
                                    <td className="px-4 py-2 border">{order.city}</td>
                                    <td className="px-4 py-2 border">${order.totalAmount}</td>
                                    <td className="px-4 py-2 border  text-center">
                                        {order.payment ? (
                                            <span className="text-green-600 font-medium flex text-center items-center justify-center"><Check className='me-2' size={20} /> Paid</span>
                                        ) : (
                                            <span className="text-red-500 font-bold">❌ Unpaid</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => openModal(order)}
                                            className="bg-blue-500 hover:bg-blue-600 transition text-white text-xs px-3 py-2 rounded"
                                        >
                                            View List
                                        </button>
                                    </td>

                                    <td className="px-4 py-2 border">
                                        <button
                                            disabled={loadingOrderId === order._id}
                                            onClick={() => handleCompleteOrder(order._id)}
                                            className="bg-green-500 hover:bg-green-600 transition text-white text-xs   py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            {
                                                loadingOrderId === order._id ? <LoadingSpin /> : 'Complete'
                                            }
                                        </button>
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

            {/* Modal */}
            {
                isModalOpen && selectedOrder && (
                    <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full">
                            <h2 className="text-xl font-bold mb-4">Order Details</h2>
                            <div className="overflow-y-auto max-h-[400px] ">
                                {selectedOrder.cartItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 p-4 mb-4 border rounded-lg shadow-sm bg-gray-50">
                                        {/* Product Image */}
                                        <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-md" />

                                        {/* Product Details */}
                                        <div className="flex flex-col   text-left">
                                            <p className="font-semibold">{item.title}</p>

                                            {/* Color, Size, Quantity */}
                                            <div className="flex items-center space-x-4">
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    Color: <img src={item.color} className="w-8 h-8 object-cover rounded-md ml-2" alt="" />
                                                </p>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>

                                            {/* Price */}
                                            <p className="font-medium text-gray-600">Price: ${item.price}</p>
                                        </div>
                                    </div>

                                ))}
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }


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

        </div >
    );
};

export default Orders;
