// Mock client service - no backend API calls

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_CLIENTS = [
  {
    clientId: 'CLIENT-001',
    name: 'Zenith Pensions',
    segment: 'Pension',
    kycData: {
      email: 'client@example.com',
      phone: '+234 800 000 0000',
      address: '123 Marina Street, Lagos, Nigeria',
      contact: 'John Doe',
    },
    portfolios: [
      {
        portfolioId: 'PF-001',
        name: 'Core Holdings',
        aum: 650000000,
      },
      {
        portfolioId: 'PF-002',
        name: 'Liquidity Sleeve',
        aum: 180000000,
      },
    ],
    holdings: [],
  },
  {
    clientId: 'CLIENT-002',
    name: 'Unity Insurance',
    segment: 'Insurance',
    kycData: {
      email: 'admin@example.com',
      phone: '+234 800 000 1234',
      address: '45 Awolowo Road, Ikoyi, Lagos',
      contact: 'Jane Smith',
    },
    portfolios: [
      {
        portfolioId: 'PF-100',
        name: 'Core Fund',
        aum: 420000000,
      },
    ],
    holdings: [],
  },
];

const generateHoldings = () => {
  const instruments = [
    { isin: 'NG1234567890', instrumentName: 'ZENITHBANK', price: 35.4 },
    { isin: 'NG0987654321', instrumentName: 'GTCO', price: 28.1 },
    { isin: 'NG1111111111', instrumentName: 'MTNN', price: 245.8 },
    { isin: 'NG2222222222', instrumentName: 'DANGCEM', price: 320.5 },
    { isin: 'NG3333333333', instrumentName: 'UBA', price: 22.3 },
  ];

  return instruments.map((inst, idx) => {
    const quantity = 500000 + idx * 25000 + Math.floor(Math.random() * 20000);
    const value = quantity * inst.price;
    return {
      ...inst,
      quantity,
      value,
    };
  });
};

export const clientService = {
  async getClient(clientId) {
    await delay();
    const client = MOCK_CLIENTS.find((c) => c.clientId === clientId) || MOCK_CLIENTS[0];
    return JSON.parse(JSON.stringify(client));
  },

  async getClients() {
    await delay();
    return JSON.parse(JSON.stringify(MOCK_CLIENTS));
  },

  async updateClient(clientId, data) {
    await delay();
    const client = MOCK_CLIENTS.find((c) => c.clientId === clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    Object.assign(client, data);
    return JSON.parse(JSON.stringify(client));
  },

  async getPortfolio(clientId, portfolioId) {
    await delay();
    const client = MOCK_CLIENTS.find((c) => c.clientId === clientId) || MOCK_CLIENTS[0];
    const portfolio = client.portfolios.find((p) => p.portfolioId === portfolioId) || client.portfolios[0];
    return JSON.parse(JSON.stringify(portfolio));
  },

  async getHoldings(clientId) {
    await delay();
    const client = MOCK_CLIENTS.find((c) => c.clientId === clientId) || MOCK_CLIENTS[0];
    if (!client.holdings || client.holdings.length === 0) {
      client.holdings = generateHoldings();
    }
    return {
      holdings: JSON.parse(JSON.stringify(client.holdings)),
    };
  },
};

