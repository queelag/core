import { STUB_DOCUMENT_COOKIE_ATTRIBUTES } from '../../src/definitions/stubs'

global.document = global.document || {}
Object.defineProperty(global.document, 'cookie', STUB_DOCUMENT_COOKIE_ATTRIBUTES)
