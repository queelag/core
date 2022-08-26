![Scrutinizer coverage (GitHub/BitBucket)](https://img.shields.io/scrutinizer/coverage/g/queelag/core?style=for-the-badge)

# Queelag Core

This library contains a collection of functions, modules and utilities to make your development experience smoother.

### Main Features

[x] Highly Tree-Shakeable
[x] Improved Cookie, Fetch, Storage and WebSocket APIs
[x] GraphQL Friendly
[x] Smart Polyfilling
[x] Primitive Utilities

### Functions

[x] gql -> returns GraphQL query
[x] noop -> returns void
[x] rc -> returns a custom value from a function
[x] rcp -> returns a custom value from an async function
[x] rv -> returns void from a function
[x] rvp -> returns void from an async function
[x] sleep -> returns a promise that resolves after ms time
[x] tc -> try catches a function
[x] tcp -> try catches an async function
[x] tie -> throws if value is error
[x] tne -> throws new error

### Modules

[x] API -> axios like but with fetch
[x] Base16 -> decodes and encodes base16
[x] Base32 -> decodes and encodes base32
[x] Base32 -> decodes and encodes base64
[x] Cookie -> CRUD for cookies
[x] Debounce -> runs a function if not called again for ms time
[x] DeferredPromise -> a promise that can be resolved or rejected from outside
[x] Environment -> exposes common environment checks and variables
[x] Fetch -> improves base fetch by adding node polyfilling and incoming/outgoing body transformation
[x] GraphQLAPI -> extends API and exposes query and mutation methods
[x] History -> watches a target object and can undo/redo changes
[x] ID -> expands the nanoid API
[x] Interval -> easier start/stop control over intervals
[x] LocalStorage -> implements Storage
[x] Localization -> basic language based localization with variables support
[x] Logger -> classic logger class with prettier prints and ANSI colors
[x] Polyfill -> what the name says
[x] SessionStorage -> implements Storage
[x] Status -> 4 state key based status
[x] Storage -> abstract layer for storage CRUD
[x] TextCodec -> exposes TextDecoder and TextEncoder APIs
[x] Throttle -> runs a function if called after ms time since last execution
[x] Timeout -> easier start/stop control over timeouts
[x] WebSocket -> async start/stop and incoming/outgoing data transformation

### Utilities

[] To be written
