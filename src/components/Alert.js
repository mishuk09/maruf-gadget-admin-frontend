import PropTypes from "prop-types";
import { Check } from 'lucide-react';


const Alert = ({ name }) => {
    return (

        <div className="fixed top-2 right-2 z-30 px-4 py-2">


            <div className="bg-green-100 relative border border-green-500 flex items-center justify-center px-4 h-12 text-green-700 rounded font-bold">
                <div className=" absolute left-0 top-0 border border-green-500 rounded-l px-2 w-2 h-full border-r-2 bg-green-500">

                </div>
                <div className="px-4 py-2">
                    <Check size={20} className="text-white bg-green-500 rounded-full p-1" />
                </div>
                {name}
            </div>
        </div>

    );
};

Alert.propTypes = {
    name: PropTypes.node.isRequired,
};
export default Alert;