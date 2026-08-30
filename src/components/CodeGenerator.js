import React, { useState } from 'react';
import { Sparkles, Copy, Check, Loader } from 'lucide-react';
import { generateUniqueCode } from './utills/generateUniqueCode';

const CodeGenerator = () => {
    const [generatedCode, setGeneratedCode] = useState('');
    const [codeLoading, setCodeLoading] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    const handleGenerateCode = async () => {
        setCodeLoading(true);
        setCodeCopied(false);
        try {
            const newCode = await generateUniqueCode();
            setGeneratedCode(newCode);
        } catch (error) {
            console.error('Failed to generate code:', error);
            alert('Failed to generate unique code. Please try again.');
        } finally {
            setCodeLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            setCodeCopied(true);
            setTimeout(() => {
                setCodeCopied(false);
                setGeneratedCode('');
            }, 500);
        }
    };

    return (
        <div className="w-full max-w-3xl">
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleGenerateCode}
                    disabled={codeLoading}
                    className={`flex items-center justify-center text-sm gap-2 rounded-lg px-6 py-3 font-medium md:font-semibold transition-all duration-300 ${
                        codeLoading
                            ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-950/50'
                    }`}
                >
                    {codeLoading ? (
                        <>
                            <Loader size={18} className="animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} strokeWidth={1.8} />
                            Generate Code
                        </>
                    )}
                </button>
            </div>

            {/* Modal for Generated Code */}
            {generatedCode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-lg border border-purple-500/30 p-6 max-w-md w-full mx-4 shadow-2xl">
                        <p className="text-xs font-semibold uppercase tracking-widest text-purple-300 mb-3">Generated Code</p>
                        <p className="text-2xl md:text-3xl font-bold text-purple-100 tracking-widest text-center mb-6 break-all">{generatedCode}</p>
                        <button
                            onClick={handleCopyCode}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                                codeCopied
                                    ? 'bg-green-600 text-white'
                                    : 'bg-purple-600 text-white hover:bg-purple-500'
                            }`}
                        >
                            {codeCopied ? (
                                <>
                                    <Check size={18} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Copy Code
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeGenerator;
