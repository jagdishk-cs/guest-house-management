/** User-facing message from API / network errors */
export function getErrorMessage(err, fallback = 'Request failed') {
  const body = err?.response?.data;
  if (body?.message) return body.message;
  if (Array.isArray(body?.errors) && body.errors[0]?.msg) return body.errors[0].msg;
  if (err?.message === 'Failed to fetch') {
    return 'Cannot reach server. Start the backend on port 5000.';
  }
  return err?.message || fallback;
}
