
import { useState, useRef, useEffect } from 'react';

export function Dropdown({ trigger, children, isOpen, onClose }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function DropdownSubMenu({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <svg
            className={`h-4 w-4 transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="absolute top-8 left-0 ml-1 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
