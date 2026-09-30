import { useState } from "react";

export default function Dropdown({
  backgroundColor,
  options,
  onChange,
  value
}: {
  backgroundColor: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-white ${backgroundColor} hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-left flex items-center justify-between`}
      >
        {value}
        <svg
          className="w-2.5 h-2.5 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
