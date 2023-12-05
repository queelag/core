import { vi } from 'vitest'

vi.mock('../../src/utils/fetch-utils', async (io: any) => ({ ...(await io()), importNodeFetch: () => import('node-fetch') }))
