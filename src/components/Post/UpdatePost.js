/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`http://localhost:5000/posts/update/${id}`, token ? {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                } : {});

                const post = response.data;
                setExistingImages(Array.isArray(post.img) ? post.img : []);
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
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                }
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

            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="max-w-4xl 2xl:max-w-7xl max-h-[500px] 2xl:max-h-[600px] relative overflow-y-auto overflow-x-hidden h-auto bg-white p-4 rounded">

                    <button onClick={onClose} className='absolute top-2 right-3'><X size={18} /></button>

                    <h2 className="text-2xl text-center font-semibold mb-6">Edit Post</h2>

                    <div className="flex gap-2">
                        {existingImages.map((img, index) => (
                            <div key={index} className="relative">
                                <img src={img} alt="Existing" className="w-14 h-14 object-cover border rounded border-gray-300" />
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
                                <img src={URL.createObjectURL(image)} alt="New" className="w-14 h-14 object-cover border rounded border-gray-300" />
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
                        <div className="grid lg:grid-cols-3 gap-2 lg:gap-2">

                            <div>

                                <label className="block text-sm font-medium text-gray-700">Images:</label>

                                <input type="file" multiple onChange={handleImageChange} className="mt-1 block w-full p-1 h-8 text-xs border" />



                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category:</label>
                                <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Code:</label>
                                <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title:</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Price</label>
                                <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Old Price</label>
                                <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                <input type="number" value={stock} onChange={e => setStock(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    placeholder="Comma-separated, e.g. red, blue"
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size</label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={e => setSize(e.target.value)}
                                    placeholder="Comma-separated, e.g. S, M, L"
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <JoditEditor
                                value={description}
                                tabIndex={1}
                                onBlur={(newContent) => setDescription(newContent)}
                                onChange={(newContent) => { }}
                            />
                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 h-10 w-full addItem-btn p-2    text-white rounded-md   flex items-center justify-center"
                        >

                            {loading ? <LoadingSpin /> : 'Update'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdatePost;
