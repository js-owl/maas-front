/**
 * Minimal fetch router for unit tests.
 *
 * The app talks to the API through plain `fetch` (see src/api.ts), so mocking
 * the global is enough and avoids pulling in a service-worker based library.
 *
 * Requests that match no route throw instead of returning a default response —
 * a silently empty payload makes component failures much harder to read.
 */
import { vi } from 'vitest'

export type UrlPattern = string | RegExp

export type RecordedCall = {
  url: string
  method: string
  headers: Record<string, string>
  body: string | undefined
}

type RouteHandler = (call: RecordedCall) => Response | Promise<Response>

type Route = {
  pattern: UrlPattern
  method: string | undefined
  handler: RouteHandler
  once: boolean
  consumed: boolean
}

let routes: Route[] = []
let calls: RecordedCall[] = []
let installed = false

function matches(route: Route, call: RecordedCall): boolean {
  if (route.once && route.consumed) return false
  if (route.method && route.method !== call.method) return false
  return typeof route.pattern === 'string'
    ? call.url.includes(route.pattern)
    : route.pattern.test(call.url)
}

function toRecordedCall(input: RequestInfo | URL, init?: RequestInit): RecordedCall {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url

  const headers: Record<string, string> = {}
  new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).forEach(
    (value, key) => {
      headers[key] = value
    }
  )

  return {
    url,
    method: (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase(),
    headers,
    body: typeof init?.body === 'string' ? init.body : undefined,
  }
}

async function mockedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const call = toRecordedCall(input, init)
  calls.push(call)

  const route = routes.find((candidate) => matches(candidate, call))
  if (!route) {
    throw new Error(
      `Unmocked request: ${call.method} ${call.url}\n` +
        `Declare it with mockJson() or mockStatus() before the action under test.`
    )
  }

  route.consumed = true
  return route.handler(call)
}

/** Replaces the global fetch. Called once from the global test setup. */
export function installFetchMock(): void {
  if (installed) return
  globalThis.fetch = vi.fn(mockedFetch) as unknown as typeof fetch
  installed = true
}

/** Drops all routes and recorded calls. Runs after every test. */
export function resetFetchMock(): void {
  routes = []
  calls = []
}

function addRoute(
  pattern: UrlPattern,
  handler: RouteHandler,
  options?: { method?: string; once?: boolean }
): void {
  routes.unshift({
    pattern,
    method: options?.method?.toUpperCase(),
    handler,
    once: options?.once ?? false,
    consumed: false,
  })
}

/** Responds with a JSON body. Later registrations win over earlier ones. */
export function mockJson(
  pattern: UrlPattern,
  body: unknown,
  options?: { status?: number; method?: string; once?: boolean }
): void {
  addRoute(
    pattern,
    () =>
      new Response(JSON.stringify(body), {
        status: options?.status ?? 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    options
  )
}

/** Responds with a bare status code, optionally with a JSON error body. */
export function mockStatus(
  pattern: UrlPattern,
  status: number,
  body?: unknown,
  options?: { method?: string; once?: boolean }
): void {
  addRoute(
    pattern,
    () =>
      new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    options
  )
}

/** Simulates a transport-level failure, as thrown by a real offline fetch. */
export function mockNetworkError(pattern: UrlPattern, options?: { method?: string }): void {
  addRoute(
    pattern,
    () => {
      const error = new TypeError('Failed to fetch')
      error.name = 'TypeError'
      throw error
    },
    options
  )
}

/** Full control over the produced Response. */
export function mockRoute(
  pattern: UrlPattern,
  handler: RouteHandler,
  options?: { method?: string; once?: boolean }
): void {
  addRoute(pattern, handler, options)
}

/** Every request seen since the last reset, in chronological order. */
export function fetchCalls(pattern?: UrlPattern): RecordedCall[] {
  if (!pattern) return [...calls]
  return calls.filter((call) =>
    typeof pattern === 'string' ? call.url.includes(pattern) : pattern.test(call.url)
  )
}

/** Most recent matching request, for asserting headers or payloads. */
export function lastFetchCall(pattern?: UrlPattern): RecordedCall | undefined {
  return fetchCalls(pattern).at(-1)
}

/** Parsed JSON body of the most recent matching request. */
export function lastFetchBody<T = unknown>(pattern?: UrlPattern): T | undefined {
  const body = lastFetchCall(pattern)?.body
  return body === undefined ? undefined : (JSON.parse(body) as T)
}
