import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'sentinel-one-platform-h2hdwsvm',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_qAoph1WyP45XCpWqQLooa5GlYoDlJlkW',
  authRequired: false,
  auth: { mode: 'managed' },
})
