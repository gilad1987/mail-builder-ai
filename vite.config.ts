import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import express from 'vite3-plugin-express'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.[tj]sx?$/,
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-transform-class-properties', { loose: true }],
          'babel-plugin-styled-components',
        ],
      },
    }),
    express('src/server'),
  ],
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        useDefineForClassFields: false,
      },
    },
  },
  // base: '/mail-builder-ai/',
})
