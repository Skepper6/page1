import {defineConfig} from 'vite';
export default defineConfig({base:'./',publicDir:'client-assets',server:{host:'127.0.0.1'},build:{target:'es2020',rollupOptions:{output:{manualChunks:{three:['three'],motion:['gsap','lenis']}}}}});
