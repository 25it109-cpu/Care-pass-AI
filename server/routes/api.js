// server/routes/api.js
import express from 'express';
import { db, hashPassword } from '../services/dbService.js';
import { analyzeHealthConcern } from '../services/aiService.js';

const router = express.Router();

// Simple auth helper to extract user from Authorization header
function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  // For demo/hackathon tokens: "token-<userId>" or user ID directly
  const userId = token.startsWith('token-') ? token.replace('token-', '') : token;
  return db.findUserById(userId);
}

// Middleware: Require Authenticated User
function requireAuth(req, res, next) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid token.' });
  }
  if (!user.isActive) {
    return res.status(403).json({ error: 'Account has been deactivated.' });
  }
  req.user = user;
  next();
}

// Middleware: Require Specific Role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires ${roles.join(' or ')} access.` });
    }
    next();
  };
}

// ========================================================
// 1. AI Analysis Endpoint (Requirement 15)
// ========================================================
router.post('/analyze', async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a health concern or symptom description.' });
    }

    const analysis = await analyzeHealthConcern(text, language || 'en');
    
    // Log action if user is authenticated
    const user = getAuthUser(req);
    if (user) {
      db.logAction(user.id, 'AI_ANALYSIS_PERFORMED', 'analysis', {
        language: language || 'en',
        priority: analysis.priority
      });
    }

    return res.json(analysis);
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({
      error: 'AI service is temporarily unavailable.',
      fallbackMessage: 'Please review your information manually and consult a qualified healthcare professional.'
    });
  }
});

// ========================================================
// 2. Authentication Endpoints (Requirement 8)
// ========================================================
router.post('/auth/register', (req, res) => {
  try {
    const { email, password, fullName, role, preferredLanguage } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const newUser = db.createUser({
      email,
      password,
      fullName,
      role: role || 'PATIENT',
      preferredLanguage: preferredLanguage || 'en'
    });

    const token = `token-${newUser.id}`;
    const { passwordHash, ...userClean } = newUser;
    return res.status(201).json({ user: userClean, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated. Contact an administrator.' });
    }

    // Verify hash
    if (hashPassword(password) !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `token-${user.id}`;
    const { passwordHash, ...userClean } = user;
    db.logAction(user.id, 'USER_LOGIN', 'auth');
    return res.json({ user: userClean, token });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.get('/auth/me', requireAuth, (req, res) => {
  const { passwordHash, ...userClean } = req.user;
  res.json({ user: userClean });
});

router.post('/auth/logout', requireAuth, (req, res) => {
  db.logAction(req.user.id, 'USER_LOGOUT', 'auth');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ========================================================
// 3. Health Summaries & History Endpoints (Requirement 3G, 10)
// ========================================================
router.get('/history', requireAuth, (req, res) => {
  const summaries = db.getSummariesByUserId(req.user.id);
  res.json(summaries);
});

router.post('/history', requireAuth, (req, res) => {
  try {
    const data = req.body;
    if (!data.mainConcern) {
      return res.status(400).json({ error: 'Main concern is required to save a summary.' });
    }
    const saved = db.createSummary(req.user.id, data);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history/:id', requireAuth, (req, res) => {
  const summary = db.getSummaryById(req.params.id);
  if (!summary) return res.status(404).json({ error: 'Summary not found.' });
  // Allow owner or healthcare professional or admin
  if (summary.userId !== req.user.id && req.user.role === 'PATIENT') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  res.json(summary);
});

router.delete('/history/:id', requireAuth, (req, res) => {
  try {
    const deleted = db.deleteSummary(req.user.id, req.params.id);
    res.json({ success: true, deletedId: deleted.id });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ========================================================
// 4. Healthcare Professional Endpoints (Requirement 11)
// ========================================================
router.get('/professional/patients', requireAuth, requireRole('HEALTHCARE_PROFESSIONAL', 'ADMIN'), (req, res) => {
  const patientSummaries = db.getSharedPatientSummaries();
  res.json(patientSummaries);
});

router.get('/professional/patient/:id', requireAuth, requireRole('HEALTHCARE_PROFESSIONAL', 'ADMIN'), (req, res) => {
  const summary = db.getSummaryById(req.params.id);
  if (!summary) return res.status(404).json({ error: 'Patient summary not found.' });
  const patient = db.findUserById(summary.userId);
  res.json({
    summary,
    patient: patient ? { id: patient.id, fullName: patient.fullName, email: patient.email } : null
  });
});

// ========================================================
// 5. Emergency Contacts & Config (Requirement 3F)
// ========================================================
router.get('/emergency-contacts', requireAuth, (req, res) => {
  const contacts = db.getEmergencyContacts(req.user.id);
  res.json({
    contacts,
    emergencyNumber: req.user.emergencyNumber || process.env.EMERGENCY_NUMBER || '108'
  });
});

router.post('/emergency-contacts', requireAuth, (req, res) => {
  const { contactName, relationship, phoneNumber, isPrimary } = req.body;
  if (!contactName || !phoneNumber) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }
  const contact = db.addEmergencyContact(req.user.id, {
    contactName,
    relationship: relationship || 'Family / Contact',
    phoneNumber,
    isPrimary: !!isPrimary
  });
  res.status(201).json(contact);
});

router.delete('/emergency-contacts/:id', requireAuth, (req, res) => {
  const deleted = db.deleteEmergencyContact(req.user.id, req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Contact not found.' });
  res.json({ success: true });
});

// ========================================================
// 6. Appointments
// ========================================================
router.get('/appointments', requireAuth, (req, res) => {
  const apts = db.getAppointments(req.user.id);
  res.json(apts);
});

// ========================================================
// 7. Admin Metrics & User Management (Requirement 12)
// ========================================================
router.get('/admin/metrics', requireAuth, requireRole('ADMIN'), (req, res) => {
  const metrics = db.getAdminMetrics();
  res.json(metrics);
});

router.post('/admin/users/:id/toggle', requireAuth, requireRole('ADMIN'), (req, res) => {
  try {
    const updated = db.toggleUserActive(req.params.id);
    res.json({ success: true, user: { id: updated.id, email: updated.email, isActive: updated.isActive } });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ========================================================
// 8. Privacy Center: Data Export & Data Purge (Requirement 28)
// ========================================================
router.get('/user/export-data', requireAuth, (req, res) => {
  const exportPayload = db.exportUserData(req.user.id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=carepass-data-${req.user.id}.json`);
  res.json(exportPayload);
});

router.delete('/user/delete-data', requireAuth, (req, res) => {
  const result = db.deleteUserData(req.user.id);
  res.json(result);
});

export default router;
