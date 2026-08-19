import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminProtestManager() {
    const API_BASE = "http://localhost:5000/decision/";

    const [protests, setProtests] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorImage, setAuthorImage] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch protests
    const fetchProtests = async () => {
        try {
            const res = await axios.get(API_BASE);
            setProtests(res.data);
        } catch (err) {
            console.error("Error fetching protests:", err);
        }
    };

    useEffect(() => {
        fetchProtests();
    }, []);

    // Add or Update Protest
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!title.trim() || !description.trim() || !authorName.trim()) {
            setMessage("⚠️ Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const protestData = { title, description, authorName, authorImage };

        try {
            if (editId) {
                await axios.put(`${API_BASE}/${editId}`, protestData);
                setMessage("✅ Protest updated successfully!");
            } else {
                await axios.post(API_BASE, protestData);
                setMessage("✅ Protest added successfully!");
            }
            resetForm();
            fetchProtests();
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setAuthorName("");
        setAuthorImage("");
        setEditId(null);
    };

    const handleEdit = (p) => {
        setTitle(p.title);
        setDescription(p.description);
        setAuthorName(p.authorName);
        setAuthorImage(p.authorImage || "");
        setEditId(p._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this protest?")) return;
        try {
            await axios.delete(`${API_BASE}/${id}`);
            setMessage("🗑️ Protest deleted successfully!");
            fetchProtests();
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
        }
    };


    return (
        <div className="max-w-6xl mx-auto mt-0 bg-gray-50 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                ✊ {editId ? "Edit Protest" : "Add New Decision"}
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        placeholder="Protest title..."
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        placeholder="Protest description..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Author Name</label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            placeholder="Author name..."
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Author Image URL</label>
                        <input
                            type="text"
                            value={authorImage}
                            onChange={(e) => setAuthorImage(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            placeholder="(Optional) Image URL..."
                        />
                    </div>
                </div>



                <div className="flex gap-3">
                    <motion.button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editId ? "Update Protest" : "Save Protest"}
                    </motion.button>

                    {editId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {message && <div className="mb-6 text-center text-sm font-medium text-gray-700">{message}</div>}

            {/* TABLE */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800">📋 All Protests</h3>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-blue-100 text-left text-gray-800">
                                <th className="p-3">Title</th>
                                <th className="p-3">Images</th>
                                <th className="p-3">Author</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-center">Edit</th>
                                <th className="p-3 text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {protests.map((p) => (
                                <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{p.title}</td>
                                    <td className="p-3   items-center gap-2">
                                        {p.authorImage && (
                                            <img
                                                src={p.authorImage}
                                                alt={p.authorName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                        
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        
                                        <span>{p.authorName}</span>
                                    </td>
                                    <td className="p-3">{p.description}</td>

                                    <td className="p-3  ">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-blue-600   hover:text-blue-800 mr-3"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </td>
                                    <td className="p-3  ">
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="text-red-500   hover:text-red-700"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
