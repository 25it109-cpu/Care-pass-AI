// src/types/index.ts

export type Role = 'PATIENT' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN';

export type Priority = 'routine' | 'attention' | 'urgent';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  preferredLanguage: string;
  emergencyNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CompletenessBreakdown {
  mainConcern: boolean;
  symptoms: boolean;
  duration: boolean;
  medications: boolean;
  severity: boolean;
  additionalDetails: boolean;
}

export interface HealthSummary {
  id: string;
  userId: string;
  inputText?: string;
  language: string;
  mainConcern: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  previousConditions: string[];
  relevantInformation: string[];
  otherConcerns?: string;
  missingInformation: string[];
  priority: Priority;
  priorityReason: string;
  reason?: string;
  followUpQuestions: string[];
  completenessScore: number;
  completenessBreakdown?: CompletenessBreakdown;
  disclaimer?: string;
  isDemo?: boolean;
  label?: string;
  createdAt: string;
  patientName?: string;
  patientEmail?: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  contactName: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  providerName: string;
  specialty: string;
  appointmentDate: string;
  location?: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSummaries: number;
  languageUsage: { name: string; count: number; percent: number }[];
  priorityDistribution: { name: string; count: number; color: string }[];
  systemStatus: {
    aiEngine: string;
    database: string;
    latencyMs: number;
    activeVersion: string;
  };
  users: User[];
  recentLogs: AuditLog[];
}
