const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { cookieAuth } = require('../middlewares/cookieAuth');
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { loginSchema } = require('../validators/user.schema');

const requireAuth = [cookieAuth, auth];

// IMPORT of existing services
const CatwayService = require('../services/catway.service');
const ReservationService = require('../services/reservation.service');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Home + login EJS
router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

// Login: verifies the user, sets an HTTP-only cookie, redirects to /dashboard
router.post('/auth/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').lean();
    if (!user) return res.status(401).render('index', { title: 'Accueil', error: 'Identifiants invalides.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).render('index', { title: 'Accueil', error: 'Identifiants invalides.' });

    const payload = { id: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.redirect('/dashboard');
  } catch (e) { next(e); }
});

// Register a user
router.get('/auth/register', (req,res) => {
  res.render('register', {title: 'Créer un compte'});
});
router.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).render('register', { 
        title: 'Créer un compte', 
        error: 'Cet email est déjà utilisé.' 
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Logout: Clears the cookie and redirects
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { title: 'Tableau de bord', user: req.user });
});

// Catway details
router.get('/catways/:id', requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const cat = await CatwayService.getCatwayById(id);
    if (!cat) return res.status(404).render('errors/404', { title: 'Introuvable' });
    res.render('catways/details', {title: `Catway #${cat.catwayNumber || id}`, catway: cat});
  } catch (e) { next(e); }
});

// List of catways
router.get('/catways', requireAuth, async (req, res, next) => {
  try {
    const catways = await CatwayService.listCatways();
    res.render('catways/index', { title: 'Catways', catways });
  } catch (e) { next(e); }
});

// Reservation details
router.get('/reservations/:id', requireAuth, async (req, res, next) => {
  try {
    const reservation = await ReservationService.getReservationById(req.params.id);
    res.render('reservations/details', { title: 'Réservation', reservation });
  } catch (e) { next(e); }
});

// Global Reservations List
router.get('/reservations', requireAuth, async (req, res, next) => {
  try {
    const reservations = await ReservationService.listReservations();
    res.render('reservations/index', { title: 'Réservations', reservations });
  } catch (e) { next(e); }
});

// Docs
router.get('/docs', (req, res) => res.render('docs', { title: 'Documentation' }));

module.exports = router;
