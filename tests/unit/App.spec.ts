import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

vi.mock('vue3-gettext', () => ({
  useGettext: () => ({
    $gettext: (msg: string) => msg
  })
}))

vi.mock('../../src/components/ExcalidrawEditor.vue', () => ({
  default: {
    name: 'ExcalidrawEditor',
    props: ['initialData', 'readOnly'],
    emits: ['change', 'save'],
    template: '<div class="mock-editor" />'
  }
}))

import appDefinition from '../../src/index'
import App from '../../src/App.vue'

describe('Excalidraw app definition', () => {
  it('defines the web application with correct appInfo and routes', () => {
    expect(appDefinition).toBeDefined()
    expect(typeof appDefinition.setup).toBe('function')

    const app = (appDefinition as any).setup()
    expect(app.appInfo.id).toBe('excalidraw')
    expect(app.appInfo.name).toBe('Excalidraw')
    expect(app.appInfo.defaultExtension).toBe('excalidraw')
    expect(app.routes).toHaveLength(1)
    expect(app.routes[0].name).toBe('excalidraw')
    expect(app.routes[0].path).toBe('/:driveAliasAndItem(.*)?')
  })
})

describe('App component', () => {
  it('renders ExcalidrawEditor with props', () => {
    const wrapper = shallowMount(App, {
      props: {
        resource: { id: '1', name: 'drawing.excalidraw' } as any,
        applicationConfig: {},
        currentContent: '{"elements":[]}',
        isReadOnly: false,
        isDirty: false
      }
    })

    expect(wrapper.findComponent({ name: 'ExcalidrawEditor' }).exists()).toBe(true)
  })

  it('emits update:currentContent on change', async () => {
    const wrapper = shallowMount(App, {
      props: {
        resource: { id: '1', name: 'drawing.excalidraw' } as any,
        applicationConfig: {},
        currentContent: '',
        isReadOnly: false,
        isDirty: false
      }
    })

    const editor = wrapper.findComponent({ name: 'ExcalidrawEditor' })
    await editor.vm.$emit('change', '{"elements":[1]}')

    expect(wrapper.emitted('update:currentContent')).toBeTruthy()
    expect(wrapper.emitted('update:currentContent')![0]).toEqual(['{"elements":[1]}'])
  })

  it('emits save on save event', async () => {
    const wrapper = shallowMount(App, {
      props: {
        resource: { id: '1', name: 'drawing.excalidraw' } as any,
        applicationConfig: {},
        currentContent: '',
        isReadOnly: false,
        isDirty: false
      }
    })

    const editor = wrapper.findComponent({ name: 'ExcalidrawEditor' })
    await editor.vm.$emit('save')

    expect(wrapper.emitted('save')).toBeTruthy()
  })
})
