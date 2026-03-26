import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
         host: true, // listen on all network interfaces
    port: 5173, // optional, default is 5173
  
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});