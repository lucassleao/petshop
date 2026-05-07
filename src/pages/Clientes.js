import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '' });
  const [erro, setErro] = useState('');

  useEffect(() => { buscarClientes(); }, []);

  async function buscarClientes() {
    try {
      const resposta = await api.get('/clientes');
      setClientes(resposta.data);
    } catch (erro) {
      console.error('Erro ao buscar clientes:', erro);
    } finally {
      setLoading(false);
    }
  }

  function novoCliente() {
    setClienteEditando(null);
    setForm({ nome: '', cpf: '', email: '', telefone: '' });
    setErro('');
    setMostrarForm(true);
  }

  function editarCliente(cliente) {
    setClienteEditando(cliente.id);
    setForm({ nome: cliente.nome, cpf: cliente.cpf, email: cliente.email, telefone: cliente.telefone });
    setErro('');
    setMostrarForm(true);
  }

  async function salvar() {
    try {
      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando}`, form);
      } else {
        await api.post('/clientes', form);
      }
      setMostrarForm(false);
      buscarClientes();
    } catch (erro) {
      setErro(erro.response?.data?.mensagem || 'Erro ao salvar cliente.');
    }
  }

  async function excluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      buscarClientes();
    } catch {
      setErro('Erro ao excluir cliente.');
    }
  }

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#e94560' }}></div>
    </div>
  );

  return (
    <div>
      {/* Cabeçalho */}
      <div className="page-header">
        <h2 className="page-title">👥 Clientes</h2>
        <button className="btn btn-primary" onClick={novoCliente}>
          + Novo Cliente
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {/* Formulário */}
      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            {clienteEditando ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
          </div>
          <div className="card-body" style={{ padding: '24px' }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome completo *</label>
                <input className="form-control" placeholder="Ex: João Silva"
                  value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">CPF *</label>
                <input className="form-control" placeholder="000.000.000-00"
                  value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" placeholder="email@exemplo.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Telefone *</label>
                <input className="form-control" placeholder="(00) 00000-0000"
                  value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button className="btn btn-success" onClick={salvar}>💾 Salvar</button>
              <button className="btn btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Pets</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              ) : (
                clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td style={{ color: '#aaa', fontSize: '12px' }}>#{cliente.id}</td>
                    <td>
                      <strong>{cliente.nome}</strong>
                    </td>
                    <td style={{ color: '#666' }}>{cliente.cpf}</td>
                    <td style={{ color: '#666' }}>{cliente.email}</td>
                    <td style={{ color: '#666' }}>{cliente.telefone}</td>
                    <td>
                      <span style={{
                        background: '#e8f4fd', color: '#1a73e8',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '600'
                      }}>
                        {cliente.totalPets || 0} pets
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editarCliente(cliente)}>
                        ✏️ Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => excluir(cliente.id)}>
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}