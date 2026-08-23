/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Alert from '../Alert';
import { X } from 'lucide-react';
import LoadingSpin from '../utills/LoadingSpin';

const UpdatePost = ({ id, onClose, onUpdate }) => {
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [stock, setStock] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');
    const [successfull, setSuccessfull] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const token = localStorage.getItem('token');

                let post = null;

                try {
                    const response = await axios.get(`http://localhost:5000/posts/update/${id}`, token ? {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    } : {});
                    post = response.data;
                } catch (error) {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        window.location.href = '/signin';
                        return;
                    }

                    const fallbackResponse = await axios.get('http://localhost:5000/posts/');
                    post = Array.isArray(fallbackResponse.data)
                        ? fallbackResponse.data.find(item => item._id === id || item.id === id)
                        : null;
                }

                if (!post) {
                    console.error('Post not found for id:', id);
                    return;
                }

                setExistingImages(Array.isArray(post.img) ? post.img : (post.img ? [post.img] : []));
                setCode(post.code || '');
                setCategory(post.category || '');
                setTitle(post.title || '');
                setNewPrice(post.newPrice ?? '');
                setOldPrice(post.oldPrice ?? '');
                setStock(post.stock ?? '');
                setColor(Array.isArray(post.color) ? post.color.join(', ') : (post.color || ''));
                setSize(Array.isArray(post.size) ? post.size.join(', ') : (post.size || ''));
                setDescription(post.description || '');
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    window.location.href = '/signin';
                }
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [id]);

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
        formData.append('code', code);
        formData.append('category', category);
        formData.append('title', title);
        formData.append('newPrice', newPrice);
        formData.append('oldPrice', oldPrice);
        formData.append('stock', stock);

        parseCommaSeparatedValues(color).forEach(c => formData.append('color[]', c));
        parseCommaSeparatedValues(size).forEach(s => formData.append('size[]', s));

        formData.append('description', description);

        // Keep existing image paths so backend can preserve them during update.
        formData.append('existingImages', JSON.stringify(existingImages));
        images.forEach(image => formData.append('images', image));

        try {
            const token = localStorage.getItem('token');

          await axios.post(`http://localhost:5000/posts/update/${id}`, formData, {
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});
            setSuccessfull(true);
            onUpdate();
            setTimeout(() => {
                setSuccessfull(false);
            }, 3000);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <>  {successfull && (
            <Alert name=' Update Successful!' />
        )}

            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20 px-3">
                <div className="max-w-4xl 2xl:max-w-7xl max-h-[500px] 2xl:max-h-[600px] relative overflow-y-auto overflow-x-hidden h-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl shadow-slate-950/60 p-4 rounded-lg">

                    <button onClick={onClose} className='absolute top-2 right-3 text-slate-300 hover:text-white'><X size={18} /></button>

                    <h2 className="text-2xl text-center font-semibold mb-6 text-white">Edit Post</h2>

                    {isFetching ? (
                        <div className="flex min-h-[200px] items-center justify-center">
                            <LoadingSpin />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                {existingImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img} alt="Existing" className="w-14 h-14 object-cover border border-slate-600 rounded bg-slate-800" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}

                                {images.map((image, index) => (
                                    <div key={`${image.name}-${index}`} className="relative">
                                        <img src={URL.createObjectURL(image)} alt="New" className="w-14 h-14 object-cover border border-slate-600 rounded bg-slate-800" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 pt-6" encType="multipart/form-data">
                                <div className="grid lg:grid-cols-3 gap-2 lg:gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Category</label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Code</label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">New Price</label>
                                        <input
                                            type="number"
                                            value={newPrice}
                                            onChange={e => setNewPrice(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Old Price</label>
                                        <input
                                            type="number"
                                            value={oldPrice}
                                            onChange={e => setOldPrice(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Stock</label>
                                        <input
                                            type="number"
                                            value={stock}
                                            onChange={e => setStock(e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Color</label>
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={e => setColor(e.target.value)}
                                            placeholder="Comma-separated, e.g. red, blue"
                                            className="mt-1 block w-full p-1 h-8 text-xs text-slate-50 bg-slate-800 border border-slate-600 rounded placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200">Size</label>
                                        <input
                                            type="text"
                                            value={size}
                                            onChange={e => setSize(e.target.value)}
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
                                    {loading ? <LoadingSpin /> : 'Update'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdatePost;
