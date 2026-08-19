import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminQuestionPool() {
    const API_BASE = "http://localhost:5000/questionPool/question";

    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch questions from API
    const fetchQuestions = async () => {
        try {
            const res = await axios.get(API_BASE);
            setQuestions(res.data);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Add or Update Question
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formattedOptions = options
            .filter((opt) => opt.trim() !== "")
            .map((text) => ({ text }));

        if (!questionText.trim() || formattedOptions.length < 2) {
            setMessage("Please enter a question and at least two options.");
            setLoading(false);
            return;
        }

        try {
            if (editId) {
                // Update existing question
                await axios.put(`${API_BASE}/${editId}`, {
                    questionText,
                    options: formattedOptions,
                });
                setMessage("✅ Question updated successfully!");
            } else {
                // Create new question
                await axios.post(API_BASE, {
                    questionText,
                    options: formattedOptions,
                });
                setMessage("✅ Question added successfully!");
            }

            resetForm();
            fetchQuestions();
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setQuestionText("");
        setOptions(["", ""]);
        setEditId(null);
    };

    // Edit question (prefill form)
    const handleEdit = (q) => {
        setQuestionText(q.questionText);
        setOptions(q.options.map((opt) => opt.text));
        setEditId(q._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete question
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await axios.delete(`${API_BASE}/${id}`);
            setMessage("🗑️ Question deleted successfully!");
            fetchQuestions();
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
        }
    };

    // Option handlers
    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));
    const handleOptionChange = (i, value) => {
        const updated = [...options];
        updated[i] = value;
        setOptions(updated);
    };

    return (
        <div className="max-w-7xl mx-auto mt-0 bg-gray-50 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                🧠 {editId ? "Edit Question" : "Add New Question"}
            </h2>

            {/* FORM SECTION */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Question Text</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your question..."
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder={`Option ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="text-blue-500 hover:text-blue-700 mt-1"
                    >
                        + Add Option
                    </button>
                </div>

                <div className="flex gap-3">
                    <motion.button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editId ? "Update Question" : "Save Question"}
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

            {message && (
                <div className="mb-6 text-center text-sm font-medium text-gray-700">
                    {message}
                </div>
            )}

            {/* QUESTIONS TABLE */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800">📋 All Questions</h3>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-blue-100 text-left text-gray-800">
                                <th className="p-3">Question</th>
                                <th className="p-3">Options</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr
                                    key={q._id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium">{q.questionText}</td>
                                    <td className="p-3">
                                        {q.options.map((opt) => (
                                            <span
                                                key={opt._id}
                                                className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mr-2 mb-1"
                                            >
                                                {opt.text} ({opt.votes})
                                            </span>
                                        ))}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleEdit(q)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-red-500 hover:text-red-700"
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
