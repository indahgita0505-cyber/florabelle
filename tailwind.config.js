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
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Soft pink and blue theme
                primary: {
                    DEFAULT: '#fbcfe8', // soft pink
                    dark: '#f472b6',
                },
                secondary: {
                    DEFAULT: '#bfdbfe', // soft blue
                    dark: '#60a5fa',
                },
                brand: {
                    red: '#f43f5e', // soft rose instead of harsh red
                }
            }
        },
    },

    plugins: [forms],
};
