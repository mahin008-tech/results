/**
 * Admin authentication middleware
 * Protects all /api/admin/* routes using a secret key passed as:
 *   - Query param:  ?key=<ADMIN_KEY>
 *   - Header:       x-admin-key: <ADMIN_KEY>
 */
module.exports = function adminAuth(req, res, next) {
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!ADMIN_KEY) {
    return res.status(500).json({ success: false, message: 'Admin key not configured on server.' });
  }

  const provided = req.query.key || req.headers['x-admin-key'] || '';
  if (!provided || provided !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or missing admin key.' });
  }

  next();
};
