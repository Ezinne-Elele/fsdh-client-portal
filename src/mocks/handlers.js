import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

const API_BASE = import.meta.env.VITE_CORE_API || 'http://localhost:3000';

export const handlers = [
  // Auth handlers
  http.post(`${API_BASE}/api/auth/login`, () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        userId: 'CLIENT-001',
        email: 'client@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'client',
      },
      requiresMFA: false,
    });
  }),

  http.post(`${API_BASE}/api/auth/verify-mfa`, () => {
    return HttpResponse.json({
      token: 'mock-jwt-token-verified',
      verified: true,
    });
  }),

  // Client handlers
  http.get(`${API_BASE}/api/clients/:clientId`, () => {
    return HttpResponse.json({
      clientId: 'CLIENT-001',
      clientName: 'Test Client',
      clientType: 'corporate',
      kycStatus: 'approved',
      kycData: {
        email: 'client@example.com',
        phone: '+2341234567890',
        address: '123 Test Street, Lagos',
      },
    });
  }),

  http.get(`${API_BASE}/api/clients/:clientId/holdings`, () => {
    const holdings = Array.from({ length: 10 }, () => ({
      isin: faker.string.alphanumeric(12).toUpperCase(),
      instrumentName: faker.company.name() + ' Stock',
      quantity: faker.number.int({ min: 100, max: 10000 }),
      price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      value: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
    }));
    return HttpResponse.json({ holdings });
  }),

  // Trade/Instruction handlers
  http.get(`${API_BASE}/api/instructions`, () => {
    const instructions = Array.from({ length: 5 }, (_, i) => ({
      instructionId: `INST-${i + 1}`,
      id: `INST-${i + 1}`,
      type: 'Trade',
      isin: faker.string.alphanumeric(12).toUpperCase(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      status: faker.helpers.arrayElement(['draft', 'submitted', 'pending', 'approved', 'completed']),
      createdAt: faker.date.recent().toISOString(),
    }));
    return HttpResponse.json({ instructions });
  }),

  http.get(`${API_BASE}/api/instructions/:id`, () => {
    return HttpResponse.json({
      instructionId: 'INST-1',
      id: 'INST-1',
      type: 'Trade',
      isin: 'NG0000000001',
      quantity: 1000,
      price: 150.50,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }),

  // Notification handlers
  http.get(`${API_BASE}/api/notifications`, ({ request }) => {
    const url = new URL(request.url);
    const unread = url.searchParams.get('unread') === 'true';
    
    const notifications = Array.from({ length: unread ? 3 : 10 }, (_, i) => ({
      notificationId: `NOTIF-${i + 1}`,
      id: `NOTIF-${i + 1}`,
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      read: unread ? false : i < 7,
      timestamp: faker.date.recent().toISOString(),
    }));
    return HttpResponse.json({ data: notifications });
  }),

  http.post(`${API_BASE}/api/notifications/:id/read`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE}/api/notifications/read-all`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API_BASE}/api/notifications/preferences`, () => {
    return HttpResponse.json({
      preferences: {
        email: true,
        sms: false,
        inApp: true,
      },
    });
  }),

  // Report handlers
  http.get(`${API_BASE}/api/reports/statements/:clientId`, () => {
    const statements = Array.from({ length: 5 }, (_, i) => ({
      statementId: `STMT-${i + 1}`,
      id: `STMT-${i + 1}`,
      type: 'Monthly',
      period: {
        startDate: faker.date.past().toISOString(),
        endDate: faker.date.recent().toISOString(),
      },
      date: faker.date.recent().toISOString(),
      status: 'available',
    }));
    return HttpResponse.json({ statements });
  }),

  http.get(`${API_BASE}/api/reports/kpis`, () => {
    return HttpResponse.json({
      settlement: {
        pendingSettlements: 5,
        settledToday: 12,
        settlementRate: 70.5,
      },
      reconciliation: {
        openBreaks: 2,
        reconciliationsToday: 3,
      },
    });
  }),

  // Audit handlers
  http.get(`${API_BASE}/api/instructions/:id/audit`, () => {
    const logs = Array.from({ length: 5 }, (_, i) => ({
      timestamp: faker.date.recent().toISOString(),
      action: faker.helpers.arrayElement(['created', 'submitted', 'approved', 'rejected']),
      userId: faker.helpers.arrayElement(['USER-001', 'USER-002', 'SYSTEM']),
      description: faker.lorem.sentence(),
    }));
    return HttpResponse.json({ data: logs });
  }),

  // Mandate handlers
  http.get(`${API_BASE}/api/mandates`, () => {
    const mandates = Array.from({ length: 3 }, (_, i) => ({
      mandateId: `MANDATE-${i + 1}`,
      id: `MANDATE-${i + 1}`,
      type: 'Trading Mandate',
      version: `${i + 1}.0`,
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      uploadedAt: faker.date.recent().toISOString(),
    }));
    return HttpResponse.json({ mandates });
  }),

  // Relationship handlers
  http.post(`${API_BASE}/api/relationship/feedback`, () => {
    return HttpResponse.json({ success: true, ticketId: 'TICKET-001' });
  }),
];

