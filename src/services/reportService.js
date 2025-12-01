// Mock reporting service - no backend API calls

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_REPORT_TYPES = [
  { id: 'portfolio-summary', name: 'Portfolio Summary' },
  { id: 'transaction-history', name: 'Transaction History' },
  { id: 'income-tax', name: 'Income & Tax Statement' },
  { id: 'corporate-actions', name: 'Corporate Actions Summary' },
];

const buildStatements = () => {
  const today = new Date();
  return Array.from({ length: 12 }, (_, idx) => {
    const statementDate = new Date(today);
    statementDate.setMonth(statementDate.getMonth() - idx);
    const periodStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
    const periodEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);
    return {
      statementId: `STMT-${202400 + idx}`,
      type: idx % 3 === 0 ? 'Monthly' : idx % 3 === 1 ? 'Quarterly' : 'Annual',
      period: {
        startDate: periodStart.toISOString(),
        endDate: periodEnd.toISOString(),
      },
      date: statementDate.toISOString(),
      status: idx <= 3 ? 'available' : 'pending',
    };
  });
};

export const reportService = {
  async getReportTypes() {
    await delay();
    return { data: MOCK_REPORT_TYPES };
  },

  async generateReport(reportType, filters, format = 'json') {
    await delay(600);
    return {
      reportType,
      filters,
      format,
      generatedAt: new Date().toISOString(),
      url: 'data:text/plain;base64,UkVQT1JULURBVEE=',
    };
  },

  async getStatements(clientId) {
    await delay();
    return {
      statements: buildStatements(),
      clientId,
    };
  },

  async downloadStatement(statementId, format = 'pdf') {
    await delay(400);
    const content = `Statement ${statementId}\nGenerated: ${new Date().toLocaleString()}\nFormat: ${format}\n\nMock data only.`;
    return new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  },

  async getKPIs() {
    await delay();
    return {
      totals: {
        assets: 8500000000,
        cash: 1200000000,
        clients: 45,
      },
      instructions: {
        pendingApproval: 12,
        completed: 234,
      },
      trades: {
        pendingSettlements: 8,
        settlementRate: 98.5,
        todaysVolume: 1250000000,
      },
      alerts: {
        openExceptions: 3,
        pendingReconciliations: 2,
        upcomingCorporateActions: 5,
      },
    };
  },
};

