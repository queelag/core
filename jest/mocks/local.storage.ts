import { STUB_LOCAL_STORAGE } from '../../src/definitions/stubs'

global.window = global.window || {}
global.localStorage = STUB_LOCAL_STORAGE
