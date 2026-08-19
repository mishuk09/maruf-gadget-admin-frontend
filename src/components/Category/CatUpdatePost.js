/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Alert from '../Alert';
import { X } from 'lucide-react';
import LoadingSpin from '../utills/LoadingSpin';

const CatUpdatePost = ({ id, onClose, onUpdate }) => {
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [stock, setStock] = useState('');
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [description, setDescription] = useState('');
    const [successfull, setSuccessfull] = useState(false);
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/cate/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const post = response.data;
                setExistingImages(post.img || []); // Ensure existing images are set
                setCategory(post.category);
                setTitle(post.title);
                setNewPrice(post.newPrice);
                setOldPrice(post.oldPrice);
                setStock(post.stock);
                setColor(post.color || []);
                setSize(post.size || []);
                setDescription(post.description);
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    window.location.href = '/signin';
                }
            }
        };
        fetchData();
    }, [id]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append('category', category);
    //     formData.append('title', title);
    //     formData.append('newPrice', newPrice);
    //     formData.append('oldPrice', oldPrice);
    //     formData.append('stock', stock);
    //     color.forEach(c => formData.append('color[]', c));
    //     size.forEach(s => formData.append('size[]', s));
    //     formData.append('description', description);

    //     existingImages.forEach(img => formData.append('existingImages[]', img));
    //     images.forEach(image => formData.append('images', image));

    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             console.error('Token not found');
    //             return;
    //         }

    //         // Send the request to update the post
    //         await axios.post(`http://localhost:5000/posts/update/${id}`, formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data',  // Set the content type to multipart/form-data
    //             }
    //         });

    //         setSuccessfull(true);
    //         onUpdate()
    //         setTimeout(() => {
    //             setSuccessfull(false)
    //         }, 3000);
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         setLoading(false)
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('category', category);
        formData.append('title', title);
        formData.append('newPrice', newPrice);
        formData.append('oldPrice', oldPrice);
        formData.append('stock', stock);
        color.forEach(c => formData.append('color[]', c));
        size.forEach(s => formData.append('size[]', s));
        formData.append('description', description);

        // Send only the final list of images (existing + new)
        const updatedImages = [...existingImages, ...images];
        updatedImages.forEach(img => formData.append('images', img));

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }

            // Send the request to update the post
            await axios.post(`http://localhost:5000/cate/cateupdate/${id}`, formData, {

                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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

    const handleAddColor = () => {
        setColor([...color, '']);
    };

    const handleColorChange = (index, value) => {
        const newColors = [...color];
        newColors[index] = value;
        setColor(newColors);
    };

    const handleAddSize = () => {
        setSize([...size, '']);
    };

    const handleSizeChange = (index, value) => {
        const newSizes = [...size];
        newSizes[index] = value;
        setSize(newSizes);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    // const handleRemoveImage = (index, type) => {
    //     if (type === 'existing') {
    //         setExistingImages(existingImages.filter((_, i) => i !== index));
    //     } else {
    //         setImages(images.filter((_, i) => i !== index));
    //     }
    // };


    return (
        <>  {successfull && (
            <Alert name=' Update Successful!' />
        )}

            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="max-w-4xl 2xl:max-w-7xl max-h-[500px] 2xl:max-h-[600px] relative overflow-y-auto overflow-x-hidden h-auto bg-white p-4 rounded">

                    <button onClick={onClose} className='absolute top-2 right-3'><X size={18} /></button>

                    <h2 className="text-2xl text-center font-semibold mb-6">Edit Item</h2>
                    {/* {images && typeof img === 'string' && (
                        <div className="mt-2 absolute top-0 left-0">
                            <img src={images} alt="Current post image" className="w-20 h-20 object-cover" />
                        </div>
                    )} */}
                    {/* 
                    {images.length > 0 && images.map((image, index) => (
                        <div key={index} className="mt-2">
                            <img
                                src={URL.createObjectURL(image)}  // Create a preview URL for the image
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover"
                            />
                        </div>
                    ))} */}

                    <div className="flex gap-2">
                        {existingImages.map((img, index) => (
                            <div key={index} className="relative">
                                <img src={img} alt="Existing" className="w-14 h-14 object-cover border rounded border-gray-300" />
                                {/* <button onClick={() => handleRemoveImage(index, 'existing')} className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1">X</button> */}
                            </div>
                        ))}

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-6" encType="multipart/form-data">
                        <div className="grid lg:grid-cols-3 gap-2 lg:gap-2">

                            <div>

                                <label className="block text-sm font-medium text-gray-700">Image:</label>
                                {/* <input
                                    type="file"
                                    multiple  // Allow multiple files
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                /> */}

                                <input type="file" multiple onChange={handleImageChange} className="mt-1 block w-full p-1 h-8 text-xs border" />



                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category:</label>
                                <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title:</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Price:</label>
                                <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Old Price:</label>
                                <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock:</label>
                                <input type="number" value={stock} onChange={e => setStock(e.target.value)} required className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Colors:</label>
                                {color.map((c, index) => (
                                    <div key={index} className="flex space-x-2 mt-1">
                                        <input
                                            type="text"
                                            value={c}
                                            onChange={e => handleColorChange(index, e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddColor} className="mt-2 text-sm text-blue-600 hover:underline">
                                    Add Color
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sizes:</label>
                                {size.map((s, index) => (
                                    <div key={index} className="flex space-x-2 mt-1">
                                        <input
                                            type="text"
                                            value={s}
                                            onChange={e => handleSizeChange(index, e.target.value)}
                                            required
                                            className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddSize} className="mt-2 text-sm text-blue-600 hover:underline">
                                    Add Size
                                </button>
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

export default CatUpdatePost;
