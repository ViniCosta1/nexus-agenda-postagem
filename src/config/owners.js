// Lista de contas disponíveis para as postagens
export const ACCOUNTS = [
  { id: 'grupo-nexus', name: 'Grupo Nexus', color: '#6117F4', initials: 'GN' },
  { id: 'executive', name: 'Executive', color: '#FF9800', initials: 'EX' },
  { id: 'systems', name: 'Systems', color: '#2196F3', initials: 'SY' },
  { id: 'lavinia', name: 'Lavínia Siviero', color: '#9C27B0', initials: 'LS' },
  { id: 'gabriel', name: 'Gabriel Angelo', color: '#4CAF50', initials: 'GA' },
  { id: 'vinicius', name: 'Vinícius Costa', color: '#00BCD4', initials: 'VC' },
];

// Lista de responsáveis disponíveis para as postagens
export const RESPONSIBLES = [
  { id: 'pedro', name: 'Pedro Lucas', color: '#FF5722', initials: 'PL' },
  { id: 'lavinia', name: 'Lavínia Siviero', color: '#9C27B0', initials: 'LS' },
  { id: 'gabriel', name: 'Gabriel Angelo', color: '#4CAF50', initials: 'GA' },
  { id: 'vinicius', name: 'Vinícius Costa', color: '#00BCD4', initials: 'VC' },
];

// Mantém compatibilidade com código existente
export const OWNERS = [...ACCOUNTS];

// Função helper para obter uma conta pelo ID
export const getAccountById = (id) => {
  return ACCOUNTS.find(account => account.id === id) || null;
};

// Função helper para obter um responsável pelo ID
export const getResponsibleById = (id) => {
  return RESPONSIBLES.find(responsible => responsible.id === id) || null;
};

// Função helper para obter um item (conta ou responsável) pelo ID
export const getOwnerById = (id) => {
  return getAccountById(id) || getResponsibleById(id) || null;
};

// Função helper para obter múltiplos responsáveis pelos IDs
export const getOwnersByIds = (ids = []) => {
  return ids.map(id => getOwnerById(id)).filter(Boolean);
};
