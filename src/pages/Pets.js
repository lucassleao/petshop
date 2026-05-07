import React, { useState, useEffect } from 'react';
import petService from '../services/petService';
import clienteService from '../services/clienteService';

function Pets() {
  const [pets, setPets] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [petEditando, setPetEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '', peso: '', clienteId: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resPets, resClientes] = await Promise.all([
        petService.listar(), clienteService.listar()
      ]);
      setPets(resPets.data);
      setClientes(resClientes.data);
      setErro('');
    } catch {
      setErro('Erro ao carregar dados.');
    }
  };

  const abrirCadastro = () => {
    setPetEditando(null);
    setForm({ nome: '', especie: '', raca: '', idade: '', peso: '', clienteId: '' });
    setMostrarForm(true);
  };

  const abrirEdicao = (pet) => {
    setPetEditando(pet);
    setForm({
      nome: pet.nome, especie: pet.especie, raca: pet.raca || '',
      idade: pet.idade || '', peso: pet.peso || '', clienteId: pet.cliente?.id || ''
    });
    setMostrarForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      nome: form.nome, especie: form.especie, raca: form.raca,
      idade: form.idade ? parseInt(form.idade) : null,
      peso: form.peso ? parseFloat(form.peso) : null,
      cliente: { id: parseInt(form.clienteId) }
    };
    try {
      if (petEditando) {
        await petService.atualizar(petEditando.id, payload);
      } else {
        await petService.cadastrar(payload);
      }
      setMostrarForm(false);
      carregarDados();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar pet.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Remover este pet?')) return;
    try {
      await petService.deletar(id);
      carregarDados();
    } catch {
      setErro('Erro ao remover pet.');
    }
  };

  const especieEmoji = (e) => {
    const m = { 'Cachorro': '🐕', 'Gato': '🐈', 'Ave': '🐦', 'Roedor': '🐹', 'Réptil': '🦎' };
    return m[e] || '🐾';
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🐾 Pets</h2>
        <button className="btn btn-primary" onClick={abrirCadastro}>+ Novo Pet</button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            {petEditando ? '✏️ Editar Pet' : '➕ Novo Pet'}
          </div>
          <div className="card-body" style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nome *</label>
                  <input type="text" className="form-control" name="nome"
                    value={form.nome} onChange={handleChange} required placeholder="Nome do pet" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Espécie *</label>
                  <select className="form-select" name="especie"
                    value={form.especie} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Cachorro">🐕 Cachorro</option>
                    <option value="Gato">🐈 Gato</option>
                    <option value="Ave">🐦 Ave</option>
                    <option value="Roedor">🐹 Roedor</option>
                    <option value="Réptil">🦎 Réptil</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Raça</label>
                  <input type="text" className="form-control" name="raca"
                    value={form.raca} onChange={handleChange} placeholder="Ex: Labrador" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Idade (anos)</label>
                  <input type="number" className="form-control" name="idade"
                    value={form.idade} onChange={handleChange} min="0" placeholder="0" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Peso (kg)</label>
                  <input type="number" step="0.1" className="form-control" name="peso"
                    value={form.peso} onChange={handleChange} placeholder="0.0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Dono *</label>
                  <select className="form-select" name="clienteId"
                    value={form.clienteId} onChange={handleChange} required>
                    <option value="">Selecione o dono...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Salvando...' : '💾 Salvar'}
                </button>
                <button type="button" className="btn btn-secondary"
                  onClick={() => setMostrarForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Pet</th>
                <th>Espécie</th>
                <th>Raça</th>
                <th>Idade</th>
                <th>Peso</th>
                <th>Dono</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    Nenhum pet cadastrado ainda.
                  </td>
                </tr>
              ) : (
                pets.map(pet => (
                  <tr key={pet.id}>
                    <td>
                      <strong>{pet.nome}</strong>
                    </td>
                    <td>{especieEmoji(pet.especie)} {pet.especie}</td>
                    <td style={{ color: '#666' }}>{pet.raca || '—'}</td>
                    <td style={{ color: '#666' }}>{pet.idade ? `${pet.idade} anos` : '—'}</td>
                    <td style={{ color: '#666' }}>{pet.peso ? `${pet.peso} kg` : '—'}</td>
                    <td>
                      <span style={{
                        background: '#f0f4ff', color: '#4a6cf7',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {pet.cliente?.nome}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => abrirEdicao(pet)}>✏️ Editar</button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletar(pet.id)}>🗑️ Remover</button>
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

export default Pets;