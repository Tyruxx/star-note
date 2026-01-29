import type { ChartConfig } from '.'
import { isClient } from '@vueuse/core'
import { useId } from 'reka-ui'
import { h, render, getCurrentInstance } from 'vue'

const cache = new Map<string, string>()

function serializeKey(key: Record<string, any>): string {
  return JSON.stringify(key, Object.keys(key).sort())
}

interface Constructor<P = any> {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (...args: any[]): { $props: P }
}

export function componentToString<P>(config: ChartConfig, component: Constructor<P>, props?: P) {
  if (!isClient) return

  const id = useId()

  // ✅ capture Nuxt/Vue app context from where this helper is called
  const instance = getCurrentInstance()
  const appContext = instance?.appContext

  return (_data: any, x: number | Date) => {
    const data = 'data' in _data ? _data.data : _data
    const serializedKey = `${id}-${serializeKey(data)}`
    const cachedContent = cache.get(serializedKey)
    if (cachedContent) return cachedContent

    const vnode = h(component as any, { ...(props as any), payload: data, config, x })

    // ✅ reattach app context so Nuxt injections exist
    if (appContext) (vnode as any).appContext = appContext

    const div = document.createElement('div')
    render(vnode, div)

    cache.set(serializedKey, div.innerHTML)
    return div.innerHTML
  }
}
