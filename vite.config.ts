import { defineConfig as defineOCConfig } from '@opencloud-eu/extension-sdk'
import { mergeConfig } from 'vite'
// @ts-expect-error veaury/vite is a CJS module
import veauryVitePlugins from 'veaury/vite'

const ocConfig = defineOCConfig({
  name: 'web-app-excalidraw',
  plugins: [] // Remove default vue plugin
})

export default (env: any) => {
  const baseConfig = typeof ocConfig === 'function' ? ocConfig(env) : ocConfig

  // Remove the vue plugin from SDK
  if (baseConfig.plugins) {
    baseConfig.plugins = baseConfig.plugins.filter((plugin: any) => plugin?.name !== 'vite:vue')
  }

  return mergeConfig(baseConfig, {
    plugins: [
      ...veauryVitePlugins({
        type: 'vue',
        reactOptions: {
          jsxRuntime: 'automatic'
        }
      })
    ],
    optimizeDeps: {
      exclude: ['veaury']
    },
    test: {
      server: {
        deps: {
          inline: ['@excalidraw/excalidraw', 'open-color']
        }
      }
    }
  })
}
