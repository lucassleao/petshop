import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pets, setPets] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    petId: '', funcionarioId: '', dataHora: '', tipoServico: '', observacoes: ''
  });

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resAg, resPets, resFuncs] = await Promise.all([
        api.get('/agendamentos'), api.get('/pets'), api.get('/funcionarios')
      ]);
      setAgendamentos(resAg.data);
      setPets(resPets.data);
      setFuncionarios(resFuncs.data);
      setErro('');
    } catch { setErro('Erro ao carregar dados.'); }
  };

  const abrirCadastro = () => {
    setEditando(null);
    setForm({ petId: '', funcionarioId: '', dataHora: '', tipoServico: '', observacoes: '' });
    setMostrarForm(true);
  };

  const abrirEdicao = (ag) => {
    setEditando(ag);
    setForm({
      petId: ag.pet?.id || '',
      funcionarioId: ag.funcionario?.id || '',
      dataHora: ag.dataHora ? ag.dataHora.slice(0, 16) : '',
      tipoServico: ag.tipoServico || '',
      observacoes: ag.observacoes || ''
    });
    setMostrarForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const payload = {
      pet: { id: parseInt(form.petId) },
      funcionario: { id: parseInt(form.funcionarioId) },
      dataHora: form.dataHora + ':00',
      tipoServico: form.tipoServico,
      observacoes: form.observacoes,
      status: 'AGENDADO'
    };
    try {
      if (editando) {
        await api.put(`/agendamentos/${editando.id}`, payload);
      } else {
        await api.post('/agendamentos', payload);
      }
      setMostrarForm(false);
      carregarDados();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar agendamento.');
    } finally { setLoading(false); }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Remover este agendamento?')) return;
    try { await api.delete(`/agendamentos/${id}`); carregarDados(); }
    catch { setErro('Erro ao remover.'); }
  };

  const handleConcluir = async (id) => {
    try {
      await api.patch(`/agendamentos/${id}/atendimento?observacoes=Atendimento concluído&status=CONCLUIDO`);
      carregarDados();
    } catch { setErro('Erro ao concluir.'); }
  };

  const formatarData = (dh) => {
    if (!dh) return '—';
    return new Date(dh).toLocaleDateString('pt-BR') + ' às ' +
      new Date(dh).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig = {
    'AGENDADO':  { bg: '#fff3cd', color: '#856404', label: 'Agendado' },
    'CONCLUIDO': { bg: '#d1e7dd', color: '#0f5132', label: 'Concluído' },
    'CANCELADO': { bg: '#f8d7da', color: '#842029', label: 'Cancelado' },
  };

  const servicoEmoji = {
    'Banho': '🛁', 'Tosa': '✂️', 'Banho e Tosa': '🛁✂️',
    'Consulta Veterinária': '🩺', 'Vacinação': '💉', 'Outro': '🔧'
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📅 Agendamentos</h2>
        <button className="btn btn-primary" onClick={abrirCadastro}>+ Novo Agendamento</button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            {editando ? '✏️ Editar Agendamento' : '➕ Novo Agendamento'}
          </div>
          <div className="card-body" style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Pet *</label>
                  <select className="form-select" name="petId"
                    value={form.petId} onChange={handleChange} required>
                    <option value="">Selecione o pet...</option>
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} — {p.cliente?.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Funcionário *</label>
                  <select className="form-select" name="funcionarioId"
                    value={form.funcionarioId} onChange={handleChange} required>
                    <option value="">Selecione o funcionário...</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.id}>{f.nome} — {f.cargo}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo de Serviço *</label>
                  <select className="form-select" name="tipoServico"
                    value={form.tipoServico} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Banho">🛁 Banho</option>
                    <option value="Tosa">✂️ Tosa</option>
                    <option value="Banho e Tosa">🛁✂️ Banho e Tosa</option>
                    <option value="Consulta Veterinária">🩺 Consulta Veterinária</option>
                    <option value="Vacinação">💉 Vacinação</option>
                    <option value="Outro">🔧 Outro</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Data e Hora *</label>
                  <input type="datetime-local" className="form-control" name="dataHora"
                    value={form.dataHora} onChange={handleChange} required />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Observações</label>
                  <input type="text" className="form-control" name="observacoes"
                    value={form.observacoes} onChange={handleChange}
                    placeholder="Informações adicionais..." />
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
                <th>Dono</th>
                <th>Funcionário</th>
                <th>Serviço</th>
                <th>Data e Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    Nenhum agendamento cadastrado.
                  </td>
                </tr>
              ) : (
                agendamentos.map(ag => {
                  const sc = statusConfig[ag.status] || statusConfig['AGENDADO'];
                  return (
                    <tr key={ag.id}>
                      <td><strong>{ag.pet?.nome}</strong></td>
                      <td style={{ color: '#666' }}>{ag.pet?.cliente?.nome}</td>
                      <td style={{ color: '#666' }}>{ag.funcionario?.nome}</td>
                      <td>{servicoEmoji[ag.tipoServico] || '🔧'} {ag.tipoServico}</td>
                      <td style={{ color: '#555', fontSize: '13px' }}>{formatarData(ag.dataHora)}</td>
                      <td>
                        <span style={{
                          backgroundColor: sc.bg, color: sc.color,
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '600'
                        }}>{sc.label}</span>
                      </td>
                      <td>
                        {ag.status === 'AGENDADO' && (
                          <button className="btn btn-sm btn-success me-1"
                            onClick={() => handleConcluir(ag.id)}>✅</button>
                        )}
                        <button className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => abrirEdicao(ag)}>✏️</button>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletar(ag.id)}>🗑️</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Agendamentos;