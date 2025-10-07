require('dotenv').config();

const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openapi = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongodb = require('./config/db')

mongodb.initClientDbConnection();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
