import api from './api';

const clienteService = {
  listar: () => api.get('/clientes'),
};

export default clienteService;