import api from './api';

const petService = {
  listar: () => api.get('/pets'),
  cadastrar: (data) => api.post('/pets', data),
  atualizar: (id, data) => api.put(`/pets/${id}`, data),
  deletar: (id) => api.delete(`/pets/${id}`),
};

export default petService;