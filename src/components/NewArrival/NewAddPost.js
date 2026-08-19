import React, { useState, useRef } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import { X } from 'lucide-react';
import Alert from '../Alert';
import LoadingSpin from '../utills/LoadingSpin';

const NewAddPost = ({ onClose, onAdd }) => {
    // const [img, setImg] = useState(null);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');

    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upazila, setUpazila] = useState('');
    const [title, setTitle] = useState('');

    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        // formData.append('image', img);
        images.forEach(image => formData.append('images', image));
        formData.append('category', category);
        formData.append('title', title);
        formData.append('divission', divission);
        formData.append('district', district);
        formData.append('upazila', upazila);

        // formData.append('title', title);
        // formData.append('newPrice', newPrice);
        // formData.append('oldPrice', oldPrice);
        // formData.append('stock', stock);
        // color.forEach(c => formData.append('color[]', c));
        // size.forEach(s => formData.append('size[]', s));
        formData.append('description', description);

        try {
            const res = await axios.post('http://localhost:5000/top-front/front-news', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Reset fields
            // setImg('');
            setImages([]);
            setCategory('');
            setTitle('');
            setDivission('');
            setDistrict('');
            setUpazila('');

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
            console.error(err);
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

                    <h2 className="text-2xl text-center font-semibold mb-6">Add News</h2>

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
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                >
                                    <option value="" disabled>Select a Category</option>
                                    <option value="বাংলাদেশ">বাংলাদেশ</option>
                                    <option value="বিশ্ব">বিশ্ব</option>
                                    <option value="স্বাস্থ্য">স্বাস্থ্য</option>
                                    <option value="ধর্ম">ধর্ম</option>
                                    <option value="শিক্ষা">শিক্ষা</option>
                                    <option value="অর্থনীতি">অর্থনীতি</option>
                                    <option value="বাণিজ্য">বাণিজ্য</option>
                                    <option value="সারাদেশ">সারাদেশ</option>
                                    <option value="চাকরি">চাকরি</option>
                                    <option value="রাজনীতি">রাজনীতি</option>
                                    <option value="বিজ্ঞান">বিজ্ঞান</option>
                                    <option value="বিবিধ">বিবিধ</option>
                                    <option value="খেলা">খেলা</option>
                                    <option value="তথ্যপ্রযুক্তি">তথ্যপ্রযুক্তি</option>
                                    <option value="ভ্রমন">ভ্রমন</option>
                                    <option value="বিনোদন">বিনোদন</option>

                                    {/* Add more options here as needed */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tittle</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Divission</label>
                                <input
                                    type="text"
                                    value={divission}
                                    onChange={(e) => setDivission(e.target.value)}

                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">District</label>
                                <input
                                    type="text"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}

                                    className="mt-1 block w-full p-1 h-8 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upozila</label>
                                <input
                                    type="text"
                                    value={upazila}
                                    onChange={(e) => setUpazila(e.target.value)}

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

                            {loading ? <LoadingSpin /> : 'Add News'}
                        </button>



                    </form>
                </div>
            </div>

        </>
    );
}

export default NewAddPost;
