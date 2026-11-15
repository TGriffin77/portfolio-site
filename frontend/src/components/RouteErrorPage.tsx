import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function RouteErrorPage() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404
  const actionClassName = 'rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-neutral-950 transition-colors hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300'

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900 px-6 py-16 font-sans text-white">
      <div className="w-full max-w-lg text-center">
        <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-300">
          {isNotFound ? '404' : 'SOMETHING WENT WRONG'}
        </p>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          {isNotFound ? 'Page not found' : 'Unable to load this page'}
        </h1>
        <p className="mb-8 leading-relaxed text-neutral-400">
          {isNotFound
            ? 'This page may have moved, or the address may be incorrect. Head back to my portfolio to keep exploring.'
            : 'An unexpected error occurred. Try reloading the page or return to my portfolio.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/" className={actionClassName}>Back to portfolio</a>
          {!isNotFound && (
            <button type="button" onClick={() => window.location.reload()} className={actionClassName}>
              Try again
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
