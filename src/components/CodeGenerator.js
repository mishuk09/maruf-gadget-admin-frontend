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
            setTimeout(() => setCodeCopied(false), 2000);
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
                            Generate Unique Code
                        </>
                    )}
                </button>

                {generatedCode && (
                    <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 backdrop-blur-sm">
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">Generated Code</p>
                            <p className="mt-1 text-xl md:text-2xl font-bold text-purple-100 tracking-widest">{generatedCode}</p>
                        </div>
                        <button
                            onClick={handleCopyCode}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white transition-all duration-200 hover:bg-purple-500"
                            title="Copy to clipboard"
                        >
                            {codeCopied ? (
                                <Check size={18} className="text-green-400" />
                            ) : (
                                <Copy size={18} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeGenerator;
