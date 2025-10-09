// Middleware to centralize error management

function notFound(req, res) {
    res.status(404).json({error: 'Page non trouvée'});
}

function errorManage(err, req, res, next) {
    console.error('Erreur', err);
    res.status(err.status || 500).json({ error: err.message || 'Erreur interne du serveur'});
}

module.exports = { notFound, errorManage};