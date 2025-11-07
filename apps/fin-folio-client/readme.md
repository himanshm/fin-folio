`[key: string]: unknown` is an index signature.
It means the type can contain any other string-keyed properties (in addition to the explicitly named ones),
but their values are treated as unknown.
That lets you hang on to unexpected fields without TypeScript assuming anything about their shape.

`axiosError.response` is the server's HTTP response when Axios received one
but the status code signaled an error (e.g., 4xx/5xx).
It includes status, headers, data, etc.

`axiosError.request` is the low-level request object Axios created when
it sent the request but never got a response—useful for catching network failures or timeouts.
