import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: '', cargo: '', telefone: '', email: '' });

  useEffect(() => { carregarFuncionarios(); }, []);

  const carregarFuncionarios = async () => {
    try {
      const res = await api.get('/funcionarios');
      setFuncionarios(res.data);
      setErro('');
    } catch { setErro('Erro ao carregar funcionários.'); }
  };

  const abrirCadastro = () => {
    setEditando(null);
    setForm({ nome: '', cargo: '', telefone: '', email: '' });
    setErro('');
    setMostrarForm(true);
  };

  const abrirEdicao = (f) => {
    setEditando(f);
    setForm({ nome: f.nome, cargo: f.cargo, telefone: f.telefone || '', email: f.email || '' });
    setErro('');
    setMostrarForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      if (editando) {
        await api.put(`/funcionarios/${editando.id}`, form);
      } else {
        await api.post('/funcionarios', form);
      }
      setMostrarForm(false);
      carregarFuncionarios();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar funcionário.');
    } finally { setLoading(false); }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Remover este funcionário?')) return;
    try { await api.delete(`/funcionarios/${id}`); carregarFuncionarios(); }
    catch { setErro('Erro ao remover funcionário.'); }
  };

  const cargoEmoji = {
    'Veterinário': '🩺', 'Tosador': '✂️', 'Banhista': '🛁',
    'Recepcionista': '📋', 'Gerente': '👔', 'Outro': '👤'
  };

  const cargoCor = {
    'Veterinário': { bg: '#e8f4fd', color: '#1a73e8' },
    'Tosador':     { bg: '#e8f5e9', color: '#2e7d32' },
    'Banhista':    { bg: '#e3f2fd', color: '#1565c0' },
    'Recepcionista': { bg: '#fce4ec', color: '#c62828' },
    'Gerente':     { bg: '#f3e5f5', color: '#6a1b9a' },
    'Outro':       { bg: '#f5f5f5', color: '#424242' },
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">👨‍⚕️ Funcionários</h2>
        <button className="btn btn-primary" onClick={abrirCadastro}>
          + Novo Funcionário
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            {editando ? '✏️ Editar Funcionário' : '➕ Novo Funcionário'}
          </div>
          <div className="card-body" style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nome completo *</label>
                  <input type="text" className="form-control" name="nome"
                    value={form.nome} onChange={handleChange} required
                    placeholder="Ex: Dr. João Silva" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Cargo *</label>
                  <select className="form-select" name="cargo"
                    value={form.cargo} onChange={handleChange} required>
                    <option value="">Selecione o cargo...</option>
                    <option value="Veterinário">🩺 Veterinário</option>
                    <option value="Tosador">✂️ Tosador</option>
                    <option value="Banhista">🛁 Banhista</option>
                    <option value="Recepcionista">📋 Recepcionista</option>
                    <option value="Gerente">👔 Gerente</option>
                    <option value="Outro">👤 Outro</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Telefone</label>
                  <input type="text" className="form-control" name="telefone"
                    value={form.telefone} onChange={handleChange}
                    placeholder="(00) 00000-0000" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email"
                    value={form.email} onChange={handleChange}
                    placeholder="email@petshop.com" />
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

      {/* Cards de funcionários */}
      <div className="row g-3">
        {funcionarios.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center text-muted py-5">
                <p style={{ fontSize: '3rem' }}>👨‍⚕️</p>
                <p>Nenhum funcionário cadastrado ainda.</p>
                <button className="btn btn-primary" onClick={abrirCadastro}>
                  Cadastrar primeiro funcionário
                </button>
              </div>
            </div>
          </div>
        ) : (
          funcionarios.map(f => {
            const emoji = cargoEmoji[f.cargo] || '👤';
            const cor = cargoCor[f.cargo] || cargoCor['Outro'];
            return (
              <div className="col-md-4" key={f.id}>
                <div className="card h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', flexShrink: 0
                      }}>
                        {emoji}
                      </div>
                      <div>
                        <h6 style={{ margin: 0, fontWeight: '700', color: '#1a1a2e' }}>{f.nome}</h6>
                        <span style={{
                          backgroundColor: cor.bg, color: cor.color,
                          padding: '3px 10px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '600'
                        }}>
                          {emoji} {f.cargo}
                        </span>
                      </div>
                    </div>

                    {/* Informações */}
                    <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: '16px' }}>
                      {f.email && (
                        <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>
                          📧 {f.email}
                        </p>
                      )}
                      {f.telefone && (
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                          📞 {f.telefone}
                        </p>
                      )}
                      {!f.email && !f.telefone && (
                        <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
                          Sem contato cadastrado
                        </p>
                      )}
                    </div>

                    {/* Botões */}
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <button className="btn btn-sm btn-outline-primary"
                        style={{ flex: 1 }} onClick={() => abrirEdicao(f)}>
                        ✏️ Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletar(f.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Funcionarios;