import { PackageSearch } from 'lucide-react';
import React from 'react';

const Items = ({ name }) => {
    return (

        <div>
            <h2 className="flex gap-2 md:text-lg font-medium  items-center text-[var(--font-color)] "> <PackageSearch size={20} />{name}</h2>
        </div>

    );
};

export default Items;