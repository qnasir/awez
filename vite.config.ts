import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    // The 3D bundle is deliberately large and deliberately async — warning
    // about it on every build trains you to ignore the warning that matters.
    chunkSizeWarningLimit: 1000,
    // Vite preloads the dependencies of every dynamic import it can see. That
    // would hand the 267 KB 3D bundle to visitors on reduced motion, without
    // WebGL, or on a phone that never qualifies for the scene — before the
    // capability probe has even run. The scene fetches itself when, and only
    // when, a device has earned it.
    modulePreload: {
      resolveDependencies: (_url, deps) => deps.filter((d) => !/(^|\/)(three|GymScene)-/.test(d)),
    },
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vite's dynamic-import preload helper is a virtual module. Left to
          // Rollup it can be allocated into the 3D chunk, which then gets a
          // *static* import from the entry — silently pulling the entire
          // 267 KB bundle into first load for every visitor.
          if (id.includes('preload-helper')) return 'vendor'
          if (!id.includes('node_modules')) return
          // The 3D stack must stay reachable only from the lazy GymScene
          // import. Naming it explicitly keeps react-reconciler and troika
          // out of the eager react/vendor chunks, where they would be
          // downloaded by every visitor including the ones who never get
          // WebGL.
          if (
            id.includes('/three/') ||
            id.includes('@react-three') ||
            id.includes('react-reconciler') ||
            id.includes('troika') ||
            id.includes('webgl-sdf-generator') ||
            id.includes('bidi-js') ||
            id.includes('/zustand/') ||
            id.includes('suspend-react') ||
            id.includes('its-fine') ||
            id.includes('/maath/') ||
            id.includes('detect-gpu') ||
            id.includes('three-mesh-bvh') ||
            id.includes('camera-controls') ||
            id.includes('meshline') ||
            id.includes('stats-gl') ||
            id.includes('react-composer') ||
            id.includes('react-use-measure')
          ) {
            return 'three'
          }
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
