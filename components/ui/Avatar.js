import { useState } from 'react';

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);
  
  // Handle image loading errors
  const handleError = () => {
    setImageError(true);
  };

  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // Background colors based on name hash for consistent colors
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-red-400',
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-indigo-400',
    ];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={handleError}
          className="rounded-full h-full w-full object-cover"
        />
      ) : (
        <span
          className={`flex items-center justify-center rounded-full ${getBackgroundColor(name)} text-white font-medium w-full h-full`}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}