// Lista de responsáveis disponíveis para as postagens
// Pode ser expandida ou vir de um banco de dados no futuro

export const OWNERS = [
  { id: 'grupo-nexus', name: 'Grupo Nexus', color: '#6117F4', initials: 'GN' },
  { id: 'agencia-nexus', name: 'Agência Nexus', color: '#E91E63', initials: 'AN' },
  { id: 'nexus-executive', name: 'Nexus Executive', color: '#FF9800', initials: 'NE' },
  { id: 'nexus-systems', name: 'Nexus Systems', color: '#2196F3', initials: 'NS' },
  { id: 'lavinia', name: 'Lavínia Siviero', color: '#9C27B0', initials: 'LS' },
  { id: 'gabriel', name: 'Gabriel Angelo', color: '#4CAF50', initials: 'GA' },
  { id: 'vinicius', name: 'Vinicius Costa', color: '#00BCD4', initials: 'VC' },
];

// Função helper para obter um responsável pelo ID
export const getOwnerById = (id) => {
  return OWNERS.find(owner => owner.id === id) || null;
};

// Função helper para obter múltiplos responsáveis pelos IDs
export const getOwnersByIds = (ids = []) => {
  return ids.map(id => getOwnerById(id)).filter(Boolean);
};
