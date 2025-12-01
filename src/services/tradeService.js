// Mock trade service - no backend API calls

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const instructionStatuses = ['draft', 'submitted', 'pending', 'approved', 'completed', 'rejected'];

let MOCK_INSTRUCTIONS = Array.from({ length: 10 }, (_, idx) => {
  const status = instructionStatuses[Math.min(idx, instructionStatuses.length - 1)];
  return {
    id: `INS-${10000 + idx}`,
    instructionId: `INS-${10000 + idx}`,
    clientId: idx % 2 === 0 ? 'CLIENT-001' : 'CLIENT-002',
    type: idx % 3 === 0 ? 'buy' : 'sell',
    isin: idx % 2 === 0 ? 'NG1234567890' : 'NG0987654321',
    quantity: 5000 + idx * 750,
    price: 25 + idx * 1.5,
    status,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - idx * 43200000).toISOString(),
  };
});

let MOCK_TRADES = Array.from({ length: 6 }, (_, idx) => ({
  tradeId: `TRD-${2000 + idx}`,
  clientId: idx % 2 === 0 ? 'CLIENT-001' : 'CLIENT-002',
  instrument: idx % 2 === 0 ? 'ZENITHBANK' : 'GTCO',
  isin: idx % 2 === 0 ? 'NG1234567890' : 'NG0987654321',
  quantity: 10000 + idx * 2000,
  price: 30 + idx * 2,
  status: idx % 3 === 0 ? 'settled' : 'pending',
  tradeDate: new Date(Date.now() - idx * 86400000).toISOString(),
  settlementDate: new Date(Date.now() - idx * 43200000).toISOString(),
}));

export const tradeService = {
  async getTrades() {
    await delay();
    return {
      trades: JSON.parse(JSON.stringify(MOCK_TRADES)),
    };
  },

  async getTrade(tradeId) {
    await delay();
    const trade = MOCK_TRADES.find((t) => t.tradeId === tradeId);
    if (!trade) throw new Error('Trade not found');
    return JSON.parse(JSON.stringify(trade));
  },

  async createTrade(data) {
    await delay();
    const newTrade = {
      tradeId: `TRD-${Math.floor(Math.random() * 9000) + 1000}`,
      ...data,
      status: 'pending',
      tradeDate: new Date().toISOString(),
    };
    MOCK_TRADES = [newTrade, ...MOCK_TRADES];
    return JSON.parse(JSON.stringify(newTrade));
  },

  async getInstructions(params = {}) {
    await delay();
    let instructions = [...MOCK_INSTRUCTIONS];
    if (params.clientId) {
      instructions = instructions.filter((inst) => inst.clientId === params.clientId);
    }
    if (params.status) {
      instructions = instructions.filter((inst) => inst.status === params.status);
    }
    return {
      instructions: JSON.parse(JSON.stringify(instructions)),
    };
  },

  async createInstruction(data) {
    await delay();
    const newInstruction = {
      id: `INS-${Math.floor(Math.random() * 90000) + 10000}`,
      instructionId: `INS-${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    MOCK_INSTRUCTIONS = [newInstruction, ...MOCK_INSTRUCTIONS];
    return JSON.parse(JSON.stringify(newInstruction));
  },

  async getInstruction(instructionId) {
    await delay();
    const instruction = MOCK_INSTRUCTIONS.find(
      (inst) => inst.instructionId === instructionId || inst.id === instructionId
    );
    if (!instruction) throw new Error('Instruction not found');
    return JSON.parse(JSON.stringify(instruction));
  },

  async getInstructionStatus(instructionId) {
    await delay();
    const instruction = await this.getInstruction(instructionId);
    return {
      instructionId: instruction.instructionId,
      status: instruction.status,
      updatedAt: instruction.updatedAt,
    };
  },
};

