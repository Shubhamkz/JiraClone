export default function ProgressBar({ value, max = 100, className = '' }) {
  const percentage = Math.min(Math.max(0, value), max);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax={max}
      ></div>
    </div>
  );
}