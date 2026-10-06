// src/lib/api.ts
import { HealthSummary, User, EmergencyContact, Appointment, AdminMetrics } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('carepass_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An error occurred while communicating with the server.';
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // AI Analysis
  async analyzeHealthConcern(text: string, language: string = 'en'): Promise<HealthSummary> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ text, language }),
    });
    return handleResponse<HealthSummary>(res);
  },

  // Auth
  async register(payload: { email: string; password: string; fullName: string; role?: string; preferredLanguage?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ user: User; token: string }>(res);
  },

  async login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ user: User; token: string }>(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ user: User }>(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
  },

  // Health History / Summaries
  async getHistory(): Promise<HealthSummary[]> {
    const res = await fetch(`${API_BASE}/history`, {
      headers: getAuthHeader(),
    });
    return handleResponse<HealthSummary[]>(res);
  },

  async saveSummary(summary: Partial<HealthSummary>): Promise<HealthSummary> {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(summary),
    });
    return handleResponse<HealthSummary>(res);
  },

  async getSummaryById(id: string): Promise<HealthSummary> {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<HealthSummary>(res);
  },

  async deleteSummary(id: string): Promise<{ success: boolean; deletedId: string }> {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean; deletedId: string }>(res);
  },

  // Healthcare Professional
  async getProfessionalPatients(): Promise<HealthSummary[]> {
    const res = await fetch(`${API_BASE}/professional/patients`, {
      headers: getAuthHeader(),
    });
    return handleResponse<HealthSummary[]>(res);
  },

  async getProfessionalPatientDetail(id: string): Promise<{ summary: HealthSummary; patient: { id: string; fullName: string; email: string } | null }> {
    const res = await fetch(`${API_BASE}/professional/patient/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ summary: HealthSummary; patient: { id: string; fullName: string; email: string } | null }>(res);
  },

  // Emergency Contacts
  async getEmergencyContacts(): Promise<{ contacts: EmergencyContact[]; emergencyNumber: string }> {
    const res = await fetch(`${API_BASE}/emergency-contacts`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ contacts: EmergencyContact[]; emergencyNumber: string }>(res);
  },

  async addEmergencyContact(contact: { contactName: string; relationship: string; phoneNumber: string; isPrimary?: boolean }): Promise<EmergencyContact> {
    const res = await fetch(`${API_BASE}/emergency-contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(contact),
    });
    return handleResponse<EmergencyContact>(res);
  },

  async deleteEmergencyContact(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/emergency-contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Appointment[]>(res);
  },

  // Admin Metrics
  async getAdminMetrics(): Promise<AdminMetrics> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getAuthHeader(),
    });
    return handleResponse<AdminMetrics>(res);
  },

  async toggleUserActive(userId: string): Promise<{ success: boolean; user: { id: string; email: string; isActive: boolean } }> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean; user: { id: string; email: string; isActive: boolean } }>(res);
  },

  // Privacy Center
  async exportUserData(): Promise<void> {
    const token = localStorage.getItem('carepass_token');
    const res = await fetch(`${API_BASE}/user/export-data`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to export data');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carepass-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async deleteUserData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/user/delete-data`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};
