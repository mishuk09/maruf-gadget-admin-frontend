import React from 'react';
import DashboardButton from '../utills/DashboardButton';


const Dashboard = () => {
    
    return (
        <div className="p-4">
            <p className='font-medium text-xl'>All Product Dashboard</p>
            <DashboardButton add='/addpost' edit="/edit" remove="/delete" />
        </div>
    );
};

export default Dashboard;
