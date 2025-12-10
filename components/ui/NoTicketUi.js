// Custom UI Components Pack (Button, Card, Dialog, Input, Textarea, Select)
// Tailwind + Framer Motion + Modern Blue Theme

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ---------------------- BUTTON ----------------------
export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------------------- CARD ----------------------
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl border border-blue-200 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

// ---------------------- INPUT ----------------------
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

// ---------------------- TEXTAREA ----------------------
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${className}`}
      {...props}
    />
  );
}

// ---------------------- DIALOG ----------------------
export function Dialog({ trigger, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-700">Dialog</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------- SELECT ----------------------
export function Select({ items = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className="border border-blue-300 px-3 py-2 rounded-lg bg-white flex justify-between items-center cursor-pointer"
      >
        <span>{value || "Select"}</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute mt-2 w-full bg-white shadow-md rounded-lg border border-blue-200 z-20"
          >
            {items.map((item) => (
              <div
                key={item}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded"
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
