import {
  ApplicationInformation,
  AppWrapperRoute,
  defineWebApplication
} from '@opencloud-eu/web-pkg'
import '@opencloud-eu/extension-sdk/tailwind.css'
import { useGettext } from 'vue3-gettext'
import App from './App.vue'

const applicationId = 'excalidraw'

export default defineWebApplication({
  setup() {
    const { $gettext } = useGettext()

    const appInfo: ApplicationInformation = {
      name: $gettext('Excalidraw'),
      id: applicationId,
      icon: 'pencil-ruler',
      color: '#6965db',
      defaultExtension: 'excalidraw',
      extensions: [
        {
          extension: 'excalidraw',
          routeName: 'excalidraw',
          newFileMenu: {
            menuTitle: () => $gettext('Excalidraw Drawing')
          }
        }
      ]
    }

    const routes = [
      {
        name: 'excalidraw',
        path: '/:driveAliasAndItem(.*)?',
        component: AppWrapperRoute(App, {
          applicationId
        }),
        meta: {
          authContext: 'hybrid',
          patchCleanPath: true
        }
      }
    ]

    return {
      appInfo,
      routes
    }
  }
})
