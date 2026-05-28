const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/mongooseToken');
const { doubleCsrf } = require('csrf-csrf');

const ACCESS_TTL = '15m';
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createJti() {
  return crypto.randomBytes(16).toString('hex');
}

function signAccessToken(user) {
  const payload = { id: user._id.toString(), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TTL,
  });
  return token;
}

function signRefreshToken(user, jti) {
  const payload = { id: user._id.toString(), jti };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TTL_SEC,
  });
  return token;
}

// Here the data will be written to the 'refreshtokens' collection on MongoDB
async function persistRefreshToken({ user, refreshToken, jti, ip, userAgent }) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await RefreshToken.create({
    user: user._id,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent,
  });
}

function setRefreshCookie(res, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/v1/users/auth',
    maxAge: REFRESH_TTL_SEC * 1000,
  });
}

// I needed to set httpOnly to false because I needed to run in production mode
// locally in the dev environment.
// I tried setting the path as seen below but that meant the cookie was not
// accessible. Now it's set to '/' and it works.
function setAccessCookie(res, accessToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    //secure: isProd,
    secure: false,
    sameSite: 'strict',
    //path: '/api/v1/users/',
    maxAge: 60 * 15 * 1000,
  });
}

async function rotateRefreshToken(oldDoc, user, req, res) {
  // revoke old
  oldDoc.revokedAt = new Date();
  const newJti = createJti();
  oldDoc.replacedBy = newJti;
  await oldDoc.save();

  // issue new
  const newAccess = signAccessToken(user);
  const newRefresh = signRefreshToken(user, newJti);
  await persistRefreshToken({
    user,
    refreshToken: newRefresh,
    jti: newJti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });
  setRefreshCookie(res, newRefresh);
  return { accessToken: newAccess };
}

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default-csrf-secret',
  getSessionIdentifier: (req) => {
    if (req.cookies.access_token) return req.cookies.access_token;
    return 'default non-token message';
  },
  skipCsrfProtection: (req) => {
    return req.path === '/login' || req.path === '/';
  },
  cookieName: 'my-csrf-token',
  // process.env.NODE_ENV === 'production'
  //   ? '__Secure-my-csrf-token'
  //   : 'my-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

module.exports = {
  hashToken,
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
  rotateRefreshToken,
  setAccessCookie,
  doubleCsrfProtection,
};
