/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/report.tailwind.keep.html",
  ],
  safelist: [
    'p-8', 'p-2', 'p-4', 'py-1', 'py-2', 'px-2', 'px-4', 'mt-2', 'mb-2', 'mb-4', 'mb-6', 'mb-3',
    'text-xs', 'text-sm', 'text-lg', 'text-2xl',
    'font-sans', 'font-semibold', 'font-bold',
    'text-left', 'text-center',
    'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-red-500',
    'uppercase',
    'bg-gray-100', 'bg-gray-200',
    'border', 'border-collapse', 'border-gray-300', 'rounded-lg',
    'grid', 'grid-cols-2', 'gap-2', 'gap-4', 'w-full', 'h-auto', 'flex', 'flex-col',
    'table-auto',
    'object-center', 'object-cover',
    'border-b',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

