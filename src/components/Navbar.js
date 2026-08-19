import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ toggleCart, isCartOpen }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);


    return (
        <div>
            <div className="border-b shadow-md">
                <div className="container mx-auto flex justify-between items-center py-4">
                    <div className="navbar-logo">
                        <Link to='/'>
                            <img src={logo} className='w-16' alt="main-logo" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex lg:items-center lg:space-x-4 md:justify-center">

                        <div className="flex gap-6">

                            <div>
                                <Link to={isAuthenticated ? '/dashboard' : '/signin'}>
                                    <FontAwesomeIcon size='xl' icon={faUser} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Navbar;
