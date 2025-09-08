import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router'; // 'react-router' is deprecated, use 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';

// --- Data for Navigation (No changes) ---
const dropdownData = {
  backend: [
    { name: 'db.js', path: '/backends/db' },
    { name: 'package.json', path: '/backends/package' },
    { name: 'server.js', path: '/backends/server' },
    { name: 'positionController.js', path: '/backends/positionController' },
    { name: 'teacherController.js', path: '/backends/teacherController' },
    { name: 'errorHandler.js', path: '/backends/errorHandler' },
    { name: 'uploads.js', path: '/backends/uploads' },
    { name: 'index.js', path: '/backends/index' },
    { name: 'positionRoutes.js', path: '/backends/positionRoutes' },
    { name: 'teacherRoutes.js', path: '/backends/teacherRoutes' },
    { name: 'default.svg', path: '/backends/svg' },
  ],
  fontend: [
    { name: 'Nav.tsx', path: '/fontends/Nav' },
    { name: 'home.tsx', path: '/fontends/home' },
    { name: 'position.tsx', path: '/fontends/position' },
    { name: 'teacher.tsx', path: '/fontends/teacher' },
    { name: 'CustomSelect.tsx', path: '/fontends/CustomSelect' },
    { name: 'routes.ts', path: '/fontends/routes' },
    { name: 'position-simple', path: '/fontends/position-simple' },
    { name: 'teacher-simple', path: '/fontends/teacher-simple' },
  ],
  database: [
    { name: 'CREATE DATABASE', path: '/database/create-database' },
    { name: 'CREATE TABLE', path: '/database/create-table' },
    { name: 'INSERT INTO', path: '/database/insert-into' },
  ],
};

const navLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'Install', href: '/install' },
  { name: 'Backend', dropdownKey: 'backend' },
  { name: 'Fontend', dropdownKey: 'fontend' },
  { name: 'Database', dropdownKey: 'database' },
];


// --- SVG Icon Components ---
const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Main Nav Component ---
export default function Nav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const location = useLocation();
  const activePath = location.pathname;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Find Parent of the active page for highlighting the main menu
  let activeParentName: string | undefined;
  for (const key in dropdownData) {
    const items = dropdownData[key as keyof typeof dropdownData];
    if (items.some(item => item.path === activePath)) {
      activeParentName = navLinks.find(link => link.dropdownKey === key)?.name;
      break;
    }
  }

  const itemToHighlight = hoveredItem || navLinks.find(link => link.href === activePath)?.name || activeParentName;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">

        {/* Left Section: Logo and Title */}
        <Link to="/" className="flex items-center space-x-2.5">
          <img src="/rr_logo_dark.svg" alt="React Router Logo" className="h-5 w-5" />
          <span className="font-semibold text-white text-sm">
            Demo React Router Code
          </span>
        </Link>

        {/* --- 💻 Desktop Navigation --- */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-2">
            {navLinks.map((link) => {
              const dropdownItems = link.dropdownKey ? dropdownData[link.dropdownKey as keyof typeof dropdownData] : null;
              const isMainLinkActive = activePath === link.href || activeParentName === link.name;

              return (
                <li
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(link.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={link.href || '#'}
                    className={`relative z-20 block px-3 py-1.5 text-xs rounded-md transition-colors duration-300
                      ${isMainLinkActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                  {itemToHighlight === link.name && (
                    <motion.div
                      layoutId="active-nav-link-desktop"
                      className="absolute inset-0 bg-white/10 rounded-md z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <AnimatePresence>
                    {hoveredItem === link.name && dropdownItems && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-2.5 w-max z-30"
                      >
                        <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl p-3">
                          <div className="grid grid-cols-1 gap-1">
                            {dropdownItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className={`text-xs font-mono px-3 py-1.5 rounded-md block transition-colors duration-200 text-left
                                  ${activePath === item.path
                                    ? 'bg-sky-600 text-white'
                                    : 'text-gray-300 bg-gray-700/50 hover:bg-gray-600/70 hover:text-white'
                                  }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --- 📱 Mobile Menu Button --- */}
        <div className="md:hidden">
            <motion.button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? 
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{ rotate: 90, opacity: 0}}><CloseIcon /></motion.div> : 
                        <motion.div key="hamburger" initial={{ rotate: 90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{ rotate: -90, opacity: 0}}><HamburgerIcon /></motion.div>
                    }
                </AnimatePresence>
            </motion.button>
        </div>
      </div>

       {/* --- 📱 Mobile Menu Panel --- */}
       <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-t border-white/10 shadow-lg"
            >
                <ul className="p-4 space-y-2">
                    {navLinks.map(link => {
                        const dropdownItems = link.dropdownKey ? dropdownData[link.dropdownKey as keyof typeof dropdownData] : null;
                        const isDropdownOpen = openDropdown === link.dropdownKey;

                        if (!dropdownItems) {
                            return (
                                <li key={link.name}>
                                    <Link to={link.href!} className={`block px-4 py-2 rounded-md text-sm ${activePath === link.href ? 'bg-sky-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        }

                        return (
                            <li key={link.name}>
                                <button onClick={() => setOpenDropdown(isDropdownOpen ? null : link.dropdownKey!)} className={`w-full flex justify-between items-center px-4 py-2 rounded-md text-sm text-left ${activeParentName === link.name ? 'bg-white/10 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                    <span>{link.name}</span>
                                    <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.ul 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-4 mt-2 space-y-1 overflow-hidden"
                                    >
                                        {dropdownItems.map(item => (
                                            <li key={item.path}>
                                                <Link to={item.path} className={`block px-4 py-2 rounded-md text-xs font-mono ${activePath === item.path ? 'bg-sky-600/80 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                                </AnimatePresence>
                            </li>
                        )
                    })}
                </ul>
            </motion.div>
        )}
       </AnimatePresence>
    </header>
  );
}