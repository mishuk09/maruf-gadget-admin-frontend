import axios from "axios";
import React, { useEffect, useState } from "react";
import Spin from "../utills/Spin"; // Assuming this is your loading spinner component

const Category = () => {
    // State to hold the fetched category counts
    const [categoryCounts, setCategoryCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Categories array from your previous input, used for display order/completeness
    const definedCategories = [
        'বাংলাদেশ',
        'বিশ্ব',
        'বিবিধ',
        'স্বাস্থ্য',
        'ধর্ম',
        'শিক্ষা',
        'অর্থনীতি',
        'বাণিজ্য',
        'সারাদেশ',
        'রাজনীতি',
        'বিজ্ঞান',
        'খেলা',
        'তথ্যপ্রযুক্তি',
        'ভ্রমন',
        'বিনোদন'
    ];

    const fetchCategoryCounts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch data from the new endpoint we created
            const response = await axios.get('http://localhost:5000/cate/category-counts');

            // The response.data is an array like:
            // [ { category: 'বাংলাদেশ', count: 15 }, { category: 'বিশ্ব', count: 8 }, ... ]
            setCategoryCounts(response.data);
        } catch (err) {
            console.error("Error fetching category counts:", err);
            setError("Failed to load category counts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryCounts();
    }, []);

    // Function to find the count for a given category name
    const getCount = (categoryName) => {
        const item = categoryCounts.find(item => item.category === categoryName);
        return item ? item.count : 0;
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">News Counts by Category</h2>

            {loading ? (
                <div className="flex justify-center items-center h-20"><Spin /></div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-2">
                    {definedCategories.map((categoryName) => {
                        const count = getCount(categoryName);
                        return (
                            <div
                                key={categoryName}
                                className="text-gray-700 font-medium p-2 border-b border-gray-100 flex justify-between"
                            >
                                <span>{categoryName}</span>
                                {/* Format: বাংলাদেশ(XXX) */}
                                <span className="text-blue-600 font-bold">({count})</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Category;