/** Keep only allowed fields from request body (prevents cast errors on populated refs). */
export const pickFields = (body, fields) => {
  const out = {};
  if (!body || typeof body !== 'object') return out;
  for (const key of fields) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};
