// src/components/Delete.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SelectDelete = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/signin');
            return;
        }
        axios.get('http://localhost:5000/home/offer')
            .then(response => {
                setPosts(response.data.slice(0, 12));
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="  px-4 lg:px-0">
            <Link to='/offer'>Back</Link>
            <h1 className="text-2xl text-center   mb-10 font-bold">Select Item for Delete.</h1>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {posts.map((product) => (
                        <Link
                            to={`/offdelete/${product._id}`}
                            key={product._id}
                            className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-4"
                        >
                            {/* Left Section: Image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    className="w-20 h-20 object-cover rounded-sm"
                                />
                            </div>

                            {/* Right Section: Details */}
                            <div className="flex flex-col flex-grow">
                                <h2 className=" font-medium">{product.title}</h2>
                                <div className="flex justify-between items-center mb-2 mt-2">


                                    {/* Discount Section */}
                                    <div>
                                        <span className="text-green-500 font-bold">
                                            {product.offer}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            )}
        </div>
    );
}

export default SelectDelete;
