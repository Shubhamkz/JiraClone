import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ isOpen, onClose, title, children }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-[#000000ab] bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full">
          {/* Modal header */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center justify-between border-b">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {title && (
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
            )}
          </div>

          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}