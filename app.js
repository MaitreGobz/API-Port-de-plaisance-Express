require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET manquant');
  process.exit(1);
};

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cookieParser = require('cookie-parser');
const { cookieAuth } = require('./middlewares/cookieAuth');
const logger = require('morgan');
const methodOverride = require('method-override');

const cors = require('cors');
const helmet = require('helmet');

const mongodb = require('./config/db');

// Attempting to load openapi.yaml
const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
let openapi = null;
try {
    openapi = YAML.load(openapiPath); 
} catch (_) {}

const errorManage = require('./middlewares/error');

const homeRouter = require('./routes/home.routes');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');
const catwaysRouter = require('./routes/catways.routes');
const reservationsRouter = require('./routes/reservations.routes');
const webRouter = require('./routes/web.routes');

const app = express();

// DB
mongodb.initClientDbConnection();

// Security / utilitary
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'"],
      "style-src": ["'self'"]
    }
  }
}));
app.use(cors());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public'), {index: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(cookieAuth);

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use('/', webRouter);

// API routes
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/catways', reservationsRouter);

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// 404 JSON
app.use(errorManage.notFound);
app.use(errorManage.errorManage);

module.exports = app;
