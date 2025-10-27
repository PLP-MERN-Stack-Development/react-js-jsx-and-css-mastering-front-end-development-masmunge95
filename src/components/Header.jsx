import { useTheme } from '../context/ThemeContext';
import { useRef } from 'react';
import { NavHashLink } from 'react-router-hash-link';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef(null);
  
  const scrollWithOffset = (el) => {
    const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -headerHeight; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b shadow-lg border-gray-200 dark:border-gray-700">
      <nav className="mx-auto max-w-5xl p-4 flex justify-between items-center">
        <div className="text-lg font-bold text-white">Task Tracker</div>
        <div className="flex items-center gap-4">
          <div className="font-bold text-white">
            <NavHashLink smooth to="/#tasks" scroll={scrollWithOffset} className="mr-4 hover:text-blue-300 transition-colors">Tasks</NavHashLink>
            <NavHashLink smooth to="/#blog" scroll={scrollWithOffset} className="hover:text-blue-300 transition-colors">Blog</NavHashLink>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
}
