import React, { useState, useRef } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import { X } from 'lucide-react';
import Alert from '../Alert';
import LoadingSpin from '../utills/LoadingSpin';

const AddPost = ({ onClose, onAdd }) => {
    // const [img, setImg] = useState(null);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [stock, setStock] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');

    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const parseCommaSeparatedValues = (value) => {
        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        // formData.append('image', img);
        images.forEach(image => formData.append('images', image));
        formData.append('code', code);
        formData.append('category', category);
        formData.append('title', title);
        formData.append('newPrice', newPrice);
        formData.append('oldPrice', oldPrice);
        formData.append('stock', stock);

        const selectedColors = parseCommaSeparatedValues(color);
        selectedColors.forEach(selectedColor => formData.append('color[]', selectedColor));

        const selectedSizes = parseCommaSeparatedValues(size);
        selectedSizes.forEach(selectedSize => formData.append('size[]', selectedSize));

        formData.append('description', description);

        try {
            const res = await axios.post('http://localhost:5000/posts/add', formData, {
            });

            // Reset fields
            // setImg('');
            setImages([]);
            setCategory('');
            setCode('');
            setTitle('');
            setNewPrice('');
            setOldPrice('');
            setStock('');
            setColor('');
            setSize('');

            // setTitle('');
            // setNewPrice('');
            // setOldPrice('');
            // setStock('');
            // setColor([]);
            // setSize([]);
            setDescription('');

            console.log(res.data);
            setSuccessMessage(true);
            onAdd();
            setTimeout(() => setSuccessMessage(false), 3000);
        } catch (err) {
            console.error('Failed to add post:', err.response?.data || err.message || err);
        } finally {
            setLoading(false);  // Stop loading once the request completes
        }
    };



    return (
        <>
            {successMessage && (
                <Alert name='Added Successfully!' />
            )}
            <div
                className="fixed inset-0 bg-slate-900   opacity-50"
                onClick={onClose}
            ></div>

            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="max-w-4xl 2xl:max-w-7xl max-h-[500px] 2xl:max-h-[600px] relative overflow-y-auto overflow-x-hidden h-auto bg-white p-4 rounded">

                    <button onClick={onClose} className='absolute top-2 right-3'><X size={18} /></button>

                    <h2 className="text-2xl text-center font-semibold mb-6">Add Post</h2>

                    <form onSubmit={handleSubmit} className="space-y-4" method="POST" encType="multipart/form-data">
                        <div className="grid lg:grid-cols-3 gap-2 lg:gap-4">
                            {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={(e) => setImg(e.target.files[0] || null)}
                                required
                                className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                            />
                        </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Images</label>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleImageChange}
                                    multiple
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Price</label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Old Price</label>
                                <input
                                    type="number"
                                    value={oldPrice}
                                    onChange={(e) => setOldPrice(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="Comma-separated, e.g. red, blue"
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size</label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="Comma-separated, e.g. S, M, L"
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <JoditEditor
                                ref={editor}
                                value={description}
                                tabIndex={1}
                                onBlur={(newContent) => setDescription(newContent)}
                                onChange={(newContent) => setDescription(newContent)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full addItem-btn p-2 h-10  text-white rounded-md   flex items-center justify-center"
                        >

                            {loading ? <LoadingSpin /> : 'Add Post'}
                        </button>



                    </form>
                </div>
            </div>

        </>
    );
}

export default AddPost;
