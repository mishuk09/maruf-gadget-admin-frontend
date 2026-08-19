import { PackageSearch } from 'lucide-react';
import React from 'react';

const Items = ({ name }) => {
    return (

        <div>
            <h2 class="flex gap-2 text-lg font-medium  items-center text-gray-800 "> <PackageSearch size={20} />{name}</h2>
        </div>

    );
};

export default Items;