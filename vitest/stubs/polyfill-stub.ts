import { vi } from 'vitest'

vi.mock('../../src/modules/polyfill', async (io: any) => ({ ...(await io()), importNodeFetch: () => import('node-fetch') }))
