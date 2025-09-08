import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import { motion, AnimatePresence } from 'framer-motion'; // ✨ 1. Import Framer Motion

// ไอคอน (เหมือนเดิม)
const CopyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

interface CodeBlockProps {
    code: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopy = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(code)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2500);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        // ✨ 2. Animate ตัว Component ทั้งหมดเมื่อปรากฏขึ้น
        <motion.div 
            className="bg-slate-900 rounded-xl my-4 overflow-hidden shadow-2xl border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* 💅 3. ปรับ Style ของ Header ให้เป็น Gradient */}
            <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50">
                <span className="text-xs font-sans text-slate-400 uppercase tracking-wider">
                    {language || 'Code'}
                </span>
                
                <div className="flex items-center gap-3">
                     {/* 💅 4. เพิ่ม Text "Copied!" พร้อม Animation */}
                    <AnimatePresence>
                        {isCopied && (
                            <motion.span
                                key="copied-text"
                                className="text-sm text-green-400"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                Copied!
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* ✨ 5. เปลี่ยนปุ่มเป็น motion.button และเพิ่ม animation */}
                    <motion.button
                        onClick={handleCopy}
                        className={`relative flex items-center justify-center p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500/50 ${
                            isCopied 
                                ? 'bg-green-600/20 text-green-400' 
                                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200'
                        }`}
                        aria-label="Copy code"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* ✨ 6. ใช้ AnimatePresence จัดการการสลับไอคอน */}
                        <AnimatePresence mode="wait">
                            {isCopied ? (
                                <motion.span
                                    key="check"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                >
                                    <CheckIcon />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="copy"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                >
                                    <CopyIcon />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
            
            {/* 💅 7. เพิ่ม Class สำหรับ Custom Scrollbar */}
            <div className="text-sm font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                <SyntaxHighlighter 
                    language={language || 'plaintext'}
                    style={vscDarkPlus}
                    customStyle={{ 
                        margin: 0, 
                        padding: '1.25rem',
                        backgroundColor: 'transparent'
                    }}
                    wrapLongLines={true}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </motion.div>
    );
};

export default CodeBlock;