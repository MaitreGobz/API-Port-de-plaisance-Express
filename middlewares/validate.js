// Middleware to prevent invalid data, 
// to normalize the data and to centralize validation

function validate(schema, where = 'body') {
    return (req, res, next) => {

        // Validates the received data, returns errors and deletes fields that are not provided
        const { error, value } = schema.validate(req[where], {abortEarly: false, stripUnknown: true});
        if (error) return res.status(422).json({error: 'Validation error', details: error.details});
        req[where] = value;
        next();
    };
};

module.exports = { validate };