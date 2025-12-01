// Mock audit service - no backend API calls

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const buildAuditLog = (id, action, description, userId = 'SYSTEM') => ({
  id: `AUD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  referenceId: id,
  action,
  description,
  userId,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
});

export const auditService = {
  async getAuditLogs() {
    await delay();
    const logs = Array.from({ length: 10 }, (_, idx) =>
      buildAuditLog(
        `REF-${1000 + idx}`,
        idx % 2 === 0 ? 'UPDATE' : 'CREATE',
        idx % 2 === 0 ? 'Record updated' : 'Record created',
        idx % 2 === 0 ? 'CLIENT-001' : 'SYSTEM'
      )
    );
    return {
      data: logs,
    };
  },

  async getInstructionAudit(instructionId) {
    await delay();
    const logs = [
      buildAuditLog(instructionId, 'CREATE', `Instruction ${instructionId} created`, 'CLIENT-001'),
      buildAuditLog(instructionId, 'SUBMIT', `Instruction ${instructionId} submitted for approval`, 'CLIENT-001'),
      buildAuditLog(instructionId, 'REVIEW', `Instruction ${instructionId} under review`, 'OPS-USER'),
    ];
    return {
      data: logs,
    };
  },

  async exportAuditLogs() {
    await delay(500);
    return {
      message: 'Audit logs export generated (mock)',
      url: 'data:text/plain;base64,TVNXLUF1ZGl0LUxvZ3M=',
    };
  },
};

