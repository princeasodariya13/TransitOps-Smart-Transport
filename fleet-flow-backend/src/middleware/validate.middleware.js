const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error.errors && Array.isArray(error.errors)) {
            const formattedErrors = error.errors.map(e => e.message).join(', ');
            return res.status(400).json({ success: false, error: formattedErrors || 'Validation failed' });
        }
        return res.status(400).json({ success: false, error: error.message || 'Validation failed' });
    }
};

module.exports = validate;
