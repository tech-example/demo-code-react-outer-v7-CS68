import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Navigation Bar" },
    {
      name: "description",
      content: "Main navigation component for React application.",
    },
  ];
}

const navCode = `import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';

// Main navigation links (now with a flat structure, no dropdowns)
const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Positions', href: '/positions' },
    { name: 'Teachers', href: '/teachers' },
];

// Logo component using the favicon from the public folder
const Logo = () => (
    <img
        src="/favicon.ico"
        alt="React Router Logo"
        className="w-6 h-6"
    />
);

export default function Nav() {
    const location = useLocation();
    const activePath = location.pathname;

    return (
        <div className="flex justify-center w-full bg-black/80 backdrop-blur-sm fixed top-0 z-50">
            <div className="flex items-center justify-between w-full max-w-7xl px-4 py-2">
                {/* Title and Logo */}
                <div className="flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <Logo />
                        <span className="text-white text-lg font-bold">Reach-Rounter v7</span>
                    </Link>
                </div>

                {/* Navigation Links (no dropdowns) */}
                <nav className="flex items-center">
                    <ul className="flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = activePath === link.href;
                            
                            return (
                                <li key={link.name} className="relative">
                                    <Link
                                        to={link.href}
                                        className={\`relative z-20 block px-4 py-2 text-sm rounded-md transition-colors duration-300
                                            \${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}\`}
                                    >
                                        {link.name}
                                    </Link>

                                    {/* Highlight background (displays when the link is active) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav-link"
                                            className="absolute inset-0 bg-white/10 rounded-md z-10"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}`;

export default function NavPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Navigation Bar
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">Nav.tsx</code>{" "}
          ซึ่งเป็นคอมโพเนนต์หลักในการนำทางไปยังหน้าต่างๆ ของแอปพลิเคชัน
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            การทำงานและเทคโนโลยี
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้ใช้{" "}
            <code className="text-sm font-mono text-yellow-300">
              react-router
            </code>{" "}
            ในการจัดการเส้นทางและ{" "}
            <code className="text-sm font-mono text-yellow-300">
              framer-motion
            </code>{" "}
            เพื่อสร้างเอฟเฟกต์การเปลี่ยนหน้าที่มีความลื่นไหล
          </p>
          <CodeBlock code={navCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
