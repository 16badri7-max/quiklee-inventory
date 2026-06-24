const sanitizeInput = (req, res, next) => {
  // Skip sanitization for sensitive fields like password
  const SKIP_KEYS = ['password'];

  const sanitizeStr = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>?/gm, ''); // Only strip HTML tags
  };

  const sanitizeObj = (obj) => {
    for (let key in obj) {
      if (SKIP_KEYS.includes(key)) continue; // Don't sanitize password
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeStr(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObj(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObj(req.body);
  if (req.query) sanitizeObj(req.query);
  if (req.params) sanitizeObj(req.params);

  next();
};

module.exports = sanitizeInput;