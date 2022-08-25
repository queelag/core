import { STUB_SESSION_STORAGE } from '../src/definitions/stubs'

global.window = global.window || {}
global.sessionStorage = STUB_SESSION_STORAGE
