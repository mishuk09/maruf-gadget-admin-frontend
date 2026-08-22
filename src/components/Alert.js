import PropTypes from "prop-types";
import { Check, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const Alert = ({ name, type = 'success', duration = 3000 }) => {
    const [visible, setVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
        }, duration - 300);

        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [duration]);

    if (!visible) {
        return null;
    }

    const isError = type === 'error';

    return (
        <div className="fixed top-2 right-2 z-30 px-4 py-2">
            <div
                className={[
                    `${isError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} relative flex h-12 items-center justify-center rounded border px-4 font-bold`,
                    'transition-all duration-300 ease-in-out',
                    isFading ? 'pointer-events-none translate-y-[-4px] scale-95 opacity-0' : 'opacity-100'
                ].join(' ')}
            >
                <div className={`${isError ? 'border-red-500 bg-red-500' : 'border-green-500 bg-green-500'} absolute left-0 top-0 h-full w-2 rounded-l border border-r-2`}>
                </div>
                <div className="px-4 py-2">
                    {isError ? (
                        <XCircle size={20} className="rounded-full bg-red-500 p-1 text-white" />
                    ) : (
                        <Check size={20} className="rounded-full bg-green-500 p-1 text-white" />
                    )}
                </div>
                {name}
            </div>
        </div>
    );
};

Alert.propTypes = {
    name: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['success', 'error']),
    duration: PropTypes.number,
};

export default Alert;