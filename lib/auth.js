var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('./db');

var JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch(e) { return null; }
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function getAdmin() {
  var users = db.all('users');
  return users[0] || null;
}

function initAdmin() {
  var admin = getAdmin();
  if (!admin) {
    var initPwd = process.env.ADMIN_INIT_PASSWORD || require('crypto').randomBytes(6).toString('hex');
    var hash = hashPassword(initPwd);
    db.insert('users', { username: 'admin', password: hash });
    console.log('Admin user created: admin / ' + initPwd);
  }
}

module.exports = { generateToken, verifyToken, hashPassword, comparePassword, getAdmin, initAdmin };
