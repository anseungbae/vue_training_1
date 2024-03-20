/* eslint-disable */

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.ts'
