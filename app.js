require('dotenv').config();

const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const helmet = require('helmet');

const mongodb = require('./config/db');

// Attempting to load openapi.yaml
const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
let openapi = null;
try {
    openapi = YAML.load(openapiPath); 
} catch (_) {}

const homeRouter = require('./routes/home.routes');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');
const catwaysRouter = require('./routes/catways.routes');
const reservationsRouter = require('./routes/reservations.routes');

const app = express();

// DB
mongodb.initClientDbConnection();

// Security / utilitary
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static pages
app.use(express.static(path.join(__dirname, 'public')));

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// API routes
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/catways', reservationsRouter);

// 404 JSON
app.use((req, res) => res.status(404).json({error: 'Page non trouvée'}));

// Global error management
app.use((err, req, res, next) => {
    console.error('Une erreur est survenue', err);
    const status = err.status || 500;
    res.status(status).json({error: err.message || 'Erreur interne du serveur'});
});

module.exports = app;
