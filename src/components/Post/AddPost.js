import React, { useState, useRef, useMemo } from 'react';
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

    const editorConfig = useMemo(() => ({
        readonly: false,
        theme: 'dark',
        toolbarButtonSize: 'small',
        style: {
            color: '#f8fafc',
            backgroundColor: '#0f172a'
        },
        disablePlugins: ['image', 'video']
    }), []);

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
            const res = await axios.post('https://maruf-gadget-admin-backend.onrender.com/posts/add', formData, {
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
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20 px-3">
                <div className="max-w-4xl 2xl:max-w-7xl max-h-[500px] 2xl:max-h-[600px] relative overflow-y-auto overflow-x-hidden h-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl shadow-slate-950/60 p-2 rounded-lg">

                    <button onClick={onClose} className='sticky top-0 ml-auto z-10 block rounded-md bg-slate-900/95 px-1 py-1 text-slate-300 hover:text-white'>
                        <X size={18} />
                    </button>

                    <h2 className="text-2xl text-center font-semibold mb-6 text-white">Add Post</h2>

                    <form onSubmit={handleSubmit} className="space-y-4" method="POST" encType="multipart/form-data">
                        <div className="grid lg:grid-cols-3 gap-2 lg:gap-4">
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Images</label>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleImageChange}
                                    multiple
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Category</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                         
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Buy Price</label>
                                <input
                                    type="number"
                                    value={oldPrice}
                                    onChange={(e) => setOldPrice(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                               <div>
                                <label className="block text-sm font-medium text-slate-200">Sell Price</label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="Comma-separated, e.g. red, blue"
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200">Size</label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="Comma-separated, e.g. S, M, L"
                                    className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                            <div className="overflow-hidden rounded-md border border-slate-600 bg-slate-800 text-slate-50">
                                <JoditEditor
                                    ref={editor}
                                    value={description}
                                    tabIndex={1}
                                    onBlur={(newContent) => setDescription(newContent)}
                                    onChange={(newContent) => setDescription(newContent)}
                                    config={editorConfig}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 transition-colors p-2 h-10 text-white rounded-md flex items-center justify-center font-medium"
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
