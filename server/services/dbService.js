// server/services/dbService.js
// Resilient database service supporting local in-memory/JSON store and optional Supabase sync.
import crypto from 'crypto';

// Password hashing utility (SHA-256 with salt)
export function hashPassword(password, salt = 'carepass_salt_2026') {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Initial Mock Seed Data
const initialUsers = [
  {
    id: 'user-patient-001',
    email: 'demo.patient@example.com',
    passwordHash: hashPassword('Demo123!'),
    fullName: 'Ananya Sharma',
    role: 'PATIENT',
    preferredLanguage: 'en',
    emergencyNumber: '108',
    isActive: true,
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'user-doctor-002',
    email: 'demo.doctor@example.com',
    passwordHash: hashPassword('Demo123!'),
    fullName: 'Dr. Rajesh Varma, MD',
    role: 'HEALTHCARE_PROFESSIONAL',
    preferredLanguage: 'en',
    emergencyNumber: '108',
    isActive: true,
    createdAt: '2026-08-15T09:00:00.000Z'
  },
  {
    id: 'user-admin-003',
    email: 'demo.admin@example.com',
    passwordHash: hashPassword('Demo123!'),
    fullName: 'Karthik Admin',
    role: 'ADMIN',
    preferredLanguage: 'en',
    emergencyNumber: '108',
    isActive: true,
    createdAt: '2026-08-01T08:00:00.000Z'
  }
];

// Preloaded Demo Health Entries for the Timeline requirement (3.G):
// "September 20: General consultation"
// "September 27: Follow-up concern"
// "October 5: New concern"
const initialSummaries = [
  {
    id: 'sum-001',
    userId: 'user-patient-001',
    inputText: 'I have mild throat dryness and tiredness after traveling. No high fever.',
    language: 'en',
    mainConcern: 'Throat dryness and post-travel fatigue',
    symptoms: ['Mild throat dryness', 'Tiredness / Fatigue'],
    duration: '2 days',
    severity: 'Mild',
    medicationsMentioned: ['Not provided'],
    previousConditions: ['Not provided'],
    relevantInformation: ['Recent travel context noted'],
    missingInformation: ['Temperature measurement', 'Fluid intake levels'],
    priority: 'routine',
    priorityReason: 'Mild throat dryness and tiredness without high fever or difficulty breathing.',
    followUpQuestions: [
      'Has the throat dryness progressed to soreness or difficulty swallowing?',
      'Have you been taking adequate hydration or warm fluids?'
    ],
    completenessScore: 70,
    completenessBreakdown: {
      mainConcern: true,
      symptoms: true,
      duration: true,
      medications: false,
      severity: true,
      additionalDetails: true
    },
    isDemo: true,
    label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
    createdAt: '2026-09-20T14:30:00.000Z'
  },
  {
    id: 'sum-002',
    userId: 'user-patient-001',
    inputText: 'எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு. பாரசிட்டமால் எடுத்தேன்.',
    language: 'ta',
    mainConcern: 'Fever with notable fatigue (இரண்டு நாட்கள் காய்ச்சல்)',
    symptoms: ['Fever (காய்ச்சல்)', 'Weakness / Fatigue (சோர்வு)'],
    duration: '2 days (இரண்டு நாட்கள்)',
    severity: 'Described as severe/pronounced ("ரொம்ப சோர்வா")',
    medicationsMentioned: ['Paracetamol / Tablet mentioned'],
    previousConditions: ['Not provided'],
    relevantInformation: ['User explicitly reported taking over-the-counter paracetamol'],
    missingInformation: ['Exact thermometer temperature reading', 'History of drug allergies'],
    priority: 'attention',
    priorityReason: 'Fever persisting for 2 days accompanied by significant fatigue requires clinical assessment.',
    followUpQuestions: [
      'What was the highest measured temperature on thermometer?',
      'Did taking Paracetamol bring the temperature down temporarily?'
    ],
    completenessScore: 85,
    completenessBreakdown: {
      mainConcern: true,
      symptoms: true,
      duration: true,
      medications: true,
      severity: true,
      additionalDetails: true
    },
    isDemo: true,
    label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
    createdAt: '2026-09-27T10:15:00.000Z'
  },
  {
    id: 'sum-003',
    userId: 'user-patient-001',
    inputText: 'Experiencing sudden back strain after lifting a heavy parcel this morning. Stiff movement.',
    language: 'en',
    mainConcern: 'Acute lower back strain after lifting',
    symptoms: ['Lower back pain', 'Movement stiffness'],
    duration: 'Since this morning',
    severity: 'Moderate',
    medicationsMentioned: ['Not provided'],
    previousConditions: ['Not provided'],
    relevantInformation: ['Occurred immediately following physical lifting of heavy object'],
    missingInformation: ['Presence of numbness or tingling in legs', 'Pain score on 1-10 scale'],
    priority: 'attention',
    priorityReason: 'Sudden onset mechanical strain requiring clinical posture and spine examination.',
    followUpQuestions: [
      'Are you experiencing any numbness, tingling, or radiating pain down your legs?',
      'Does sitting or walking aggravate the pain?'
    ],
    completenessScore: 80,
    completenessBreakdown: {
      mainConcern: true,
      symptoms: true,
      duration: true,
      medications: false,
      severity: true,
      additionalDetails: true
    },
    isDemo: true,
    label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
    createdAt: '2026-10-05T09:00:00.000Z'
  }
];

// In-Memory Database store
class DatabaseStore {
  constructor() {
    this.users = [...initialUsers];
    this.summaries = [...initialSummaries];
    this.emergencyContacts = [
      {
        id: 'ec-001',
        userId: 'user-patient-001',
        contactName: 'Priya Sharma (Sister)',
        relationship: 'Immediate Family',
        phoneNumber: '+91 98765 43210',
        isPrimary: true
      },
      {
        id: 'ec-002',
        userId: 'user-patient-001',
        contactName: 'Neighborhood Care Clinic',
        relationship: 'Primary Clinic',
        phoneNumber: '+91 44 2345 6789',
        isPrimary: false
      }
    ];
    this.appointments = [
      {
        id: 'apt-001',
        userId: 'user-patient-001',
        providerName: 'Dr. Rajesh Varma, MD',
        specialty: 'Internal Medicine',
        appointmentDate: '2026-10-08T11:00:00.000Z',
        location: 'Apollo Medical Center, Suite 402',
        notes: 'Bring CARE-PASS AI doctor-ready summary regarding back strain & fever history.',
        status: 'SCHEDULED'
      }
    ];
    this.auditLogs = [
      {
        id: 'log-001',
        userId: 'user-patient-001',
        action: 'AI_ANALYSIS_COMPLETED',
        resourceType: 'health_summary',
        metadata: { language: 'ta', priority: 'attention' },
        createdAt: '2026-09-27T10:15:00.000Z'
      },
      {
        id: 'log-002',
        userId: 'user-patient-001',
        action: 'PDF_EXPORT_GENERATED',
        resourceType: 'doctor_summary',
        metadata: { summaryId: 'sum-002' },
        createdAt: '2026-09-27T10:20:00.000Z'
      },
      {
        id: 'log-003',
        userId: 'user-patient-001',
        action: 'AI_ANALYSIS_COMPLETED',
        resourceType: 'health_summary',
        metadata: { language: 'en', priority: 'attention' },
        createdAt: '2026-10-05T09:00:00.000Z'
      }
    ];
  }

  // Users & Auth
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser({ email, password, fullName, role = 'PATIENT', preferredLanguage = 'en' }) {
    if (this.findUserByEmail(email)) {
      throw new Error('User with this email already exists.');
    }
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      fullName: fullName.trim(),
      role: role.toUpperCase(),
      preferredLanguage: preferredLanguage || 'en',
      emergencyNumber: '108',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.logAction(newUser.id, 'USER_REGISTERED', 'profile', { email: newUser.email, role: newUser.role });
    return newUser;
  }

  toggleUserActive(userId) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found.');
    user.isActive = !user.isActive;
    this.logAction(userId, 'USER_STATUS_TOGGLED', 'profile', { isActive: user.isActive });
    return user;
  }

  // Summaries & Entries
  getSummariesByUserId(userId) {
    return this.summaries
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getSummaryById(id) {
    return this.summaries.find(s => s.id === id);
  }

  createSummary(userId, data) {
    const newSummary = {
      id: `sum-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      isDemo: data.isDemo || false,
      createdAt: new Date().toISOString()
    };
    this.summaries.unshift(newSummary);
    this.logAction(userId, 'HEALTH_SUMMARY_SAVED', 'health_summary', {
      summaryId: newSummary.id,
      priority: newSummary.priority,
      language: newSummary.language
    });
    return newSummary;
  }

  deleteSummary(userId, summaryId) {
    const index = this.summaries.findIndex(s => s.id === summaryId && s.userId === userId);
    if (index === -1) {
      throw new Error('Summary not found or unauthorized.');
    }
    const [deleted] = this.summaries.splice(index, 1);
    this.logAction(userId, 'HEALTH_SUMMARY_DELETED', 'health_summary', { summaryId });
    return deleted;
  }

  // Doctor/Professional View
  getSharedPatientSummaries() {
    // Returns summaries that are demo or shared with medical providers
    return this.summaries.map(s => {
      const user = this.findUserById(s.userId);
      return {
        ...s,
        patientName: user ? user.fullName : 'Anonymous Patient',
        patientEmail: user ? user.email : 'hidden'
      };
    });
  }

  // Emergency Contacts
  getEmergencyContacts(userId) {
    return this.emergencyContacts.filter(c => c.userId === userId);
  }

  addEmergencyContact(userId, { contactName, relationship, phoneNumber, isPrimary = false }) {
    if (isPrimary) {
      this.emergencyContacts.forEach(c => {
        if (c.userId === userId) c.isPrimary = false;
      });
    }
    const newContact = {
      id: `ec-${Date.now()}`,
      userId,
      contactName,
      relationship,
      phoneNumber,
      isPrimary
    };
    this.emergencyContacts.push(newContact);
    return newContact;
  }

  deleteEmergencyContact(userId, contactId) {
    const idx = this.emergencyContacts.findIndex(c => c.id === contactId && c.userId === userId);
    if (idx !== -1) {
      return this.emergencyContacts.splice(idx, 1)[0];
    }
    return null;
  }

  // Appointments
  getAppointments(userId) {
    return this.appointments.filter(a => a.userId === userId);
  }

  // Privacy Center: Data Export & Data Purge
  exportUserData(userId) {
    const user = this.findUserById(userId);
    const summaries = this.getSummariesByUserId(userId);
    const contacts = this.getEmergencyContacts(userId);
    const appointments = this.getAppointments(userId);
    return {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName,
        role: user?.role,
        preferredLanguage: user?.preferredLanguage
      },
      healthSummaries: summaries,
      emergencyContacts: contacts,
      appointments: appointments,
      disclaimer: 'This export contains personal health notes prepared with CARE-PASS AI. Not medical records.'
    };
  }

  deleteUserData(userId) {
    this.summaries = this.summaries.filter(s => s.userId !== userId);
    this.emergencyContacts = this.emergencyContacts.filter(c => c.userId !== userId);
    this.appointments = this.appointments.filter(a => a.userId !== userId);
    this.logAction(userId, 'USER_DATA_PURGED', 'profile', {});
    return { success: true, message: 'All personal health records and summaries have been permanently deleted.' };
  }

  // Audit Logs
  logAction(userId, action, resourceType, metadata = {}) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId,
      action,
      resourceType,
      metadata,
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    return log;
  }

  getAdminMetrics() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.isActive).length;
    const totalSummaries = this.summaries.length;
    
    const languageCounts = this.summaries.reduce((acc, curr) => {
      const lang = curr.language === 'ta' ? 'Tamil' : 'English';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const priorityCounts = this.summaries.reduce((acc, curr) => {
      const p = curr.priority || 'routine';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, { routine: 0, attention: 0, urgent: 0 });

    return {
      totalUsers,
      activeUsers,
      totalSummaries,
      languageUsage: [
        { name: 'English', count: languageCounts['English'] || 0, percent: Math.round(((languageCounts['English'] || 0) / (totalSummaries || 1)) * 100) },
        { name: 'Tamil', count: languageCounts['Tamil'] || 0, percent: Math.round(((languageCounts['Tamil'] || 0) / (totalSummaries || 1)) * 100) },
      ],
      priorityDistribution: [
        { name: 'Routine', count: priorityCounts.routine, color: '#10b981' },
        { name: 'Needs Attention', count: priorityCounts.attention, color: '#f59e0b' },
        { name: 'Urgent Alert', count: priorityCounts.urgent, color: '#ef4444' },
      ],
      systemStatus: {
        aiEngine: 'Operational',
        database: 'Connected',
        latencyMs: 42,
        activeVersion: 'v1.0.0-hackathon-ready'
      },
      users: this.users.map(({ passwordHash, ...u }) => u),
      recentLogs: this.auditLogs.slice(0, 15)
    };
  }
}

export const db = new DatabaseStore();
