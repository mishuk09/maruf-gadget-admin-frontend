import React from 'react';
import { Link } from 'react-router-dom';

const DashboardButton = ({ add, edit, remove }) => {
    return (

        <main className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Add New Items", icon: "📌", link: add, btnText: "Add Post", btnColor: "bg-blue-600 hover:bg-blue-700" },
                    { title: "Manage  Items", icon: "✏️", link: edit, btnText: "View List", btnColor: "bg-yellow-500 hover:bg-yellow-600" },
                    { title: "Delete  Items", icon: "🗑️", link: remove, btnText: "View List", btnColor: "bg-red-500 hover:bg-red-600" }
                ].map((item, index) => (
                    <div key={index} className="bg-white w-full p-6 rounded shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-xl font-semibold cursor-pointer flex items-center gap-2 mb-6">
                            <span>{item.icon}</span> {item.title}
                        </h2>
                        <Link to={item.link} className={`${item.btnColor} text-white px-4 py-2 w-full  rounded transition`}>
                            {item.btnText}
                        </Link>
                    </div>
                ))}
            </div>

        </main>





    );
};

export default DashboardButton;