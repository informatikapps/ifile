import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        colors: {
            'i-yellow-500': '#FF9800',
            'i-orange-500': '#F44336',
            'i-pink-500': '#E91E63',
            'i-pink-300': '#F06896',
            'i-pink-100': '#F8B9CF',
            'i-pink-50': '#FDE9EF',
            'white': '#ffffff',
            'i-blue-500': '#3b82f6',
            'i-blue-300': '#93c5fd',
            'i-blue-100': '#dbeafe',
            'i-blue-50': '#eff6ff',
            'i-amber-500': '#fe8e00',
            'i-amber-570': '#fe8e0070',
            'i-amber-300': '#ffaf4a',
            'i-amber-100': '#ffddb0',
            'i-amber-50': '#fff2df',
        },
        extend: {
            fontFamily: {
                sans: 'poppins',
            },
        },
    },

    plugins: [forms],
    safelist: [
        {
            pattern:
                /(bg|text|border)-(transparent|current|white|i-amber-500|i-amber-570|i-amber-100|i-amber-50|i-yellow-500|i-orange-500|i-pink-500|i-pink-300|i-pink-100|i-pink-50)/,
        },
    ],
};
