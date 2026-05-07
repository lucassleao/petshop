import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState({
    nome: '', descricao: '', precoCusto: '', precoVenda: '',
    quantidadeEstoque: '', estoqueMinimo: '', categoria: '',
    especie: '', codigoBarras: '', marca: '', fornecedor: ''
  });

  useEffect(() => { carregarProdutos(); }, []);

  const carregarProdutos = async () => {
    try {
      const res = await api.get('/produtos');
      setProdutos(res.data);
      setErro('');
    } catch { setErro('Erro ao carregar produtos.'); }
  };

  const abrirCadastro = () => {
    setEditando(null);
    setForm({
      nome: '', descricao: '', precoCusto: '', precoVenda: '',
      quantidadeEstoque: '', estoqueMinimo: '', categoria: '',
      especie: '', codigoBarras: '', marca: '', fornecedor: ''
    });
    setMostrarForm(true);
  };

  const abrirEdicao = (p) => {
    setEditando(p);
    setForm({
      nome: p.nome || '', descricao: p.descricao || '',
      precoCusto: p.precoCusto || '', precoVenda: p.precoVenda || '',
      quantidadeEstoque: p.quantidadeEstoque || '', estoqueMinimo: p.estoqueMinimo || '',
      categoria: p.categoria || '', especie: p.especie || '',
      codigoBarras: p.codigoBarras || '', marca: p.marca || '', fornecedor: p.fornecedor || ''
    });
    setMostrarForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const payload = {
      nome: form.nome, descricao: form.descricao,
      precoCusto: parseFloat(form.precoCusto),
      precoVenda: parseFloat(form.precoVenda),
      quantidadeEstoque: parseInt(form.quantidadeEstoque),
      estoqueMinimo: parseInt(form.estoqueMinimo) || 5,
      categoria: form.categoria, especie: form.especie,
      codigoBarras: form.codigoBarras, marca: form.marca, fornecedor: form.fornecedor
    };
    try {
      if (editando) {
        await api.put(`/produtos/${editando.id}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      setMostrarForm(false);
      carregarProdutos();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar produto.');
    } finally { setLoading(false); }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Remover este produto?')) return;
    try { await api.delete(`/produtos/${id}`); carregarProdutos(); }
    catch { setErro('Erro ao remover produto.'); }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const estoqueConfig = (qtd, min) => {
    if (qtd <= 0) return { bg: '#f8d7da', color: '#842029', label: `${qtd} un.` };
    if (qtd <= (min || 5)) return { bg: '#fff3cd', color: '#856404', label: `${qtd} un. ⚠️` };
    return { bg: '#d1e7dd', color: '#0f5132', label: `${qtd} un.` };
  };

  const categoriaEmoji = {
    'Alimentação': '🥣', 'Medicamento': '💊', 'Acessório': '🎀',
    'Higiene': '🧴', 'Brinquedo': '🎾', 'Outro': '📦'
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📦 Produtos</h2>
        <button className="btn btn-primary" onClick={abrirCadastro}>+ Novo Produto</button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="mb-3">
        <input type="text" className="form-control"
          style={{ maxWidth: '400px' }}
          placeholder="🔍 Buscar produto por nome..."
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            {editando ? '✏️ Editar Produto' : '➕ Novo Produto'}
          </div>
          <div className="card-body" style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nome *</label>
                  <input type="text" className="form-control" name="nome"
                    value={form.nome} onChange={handleChange} required placeholder="Nome do produto" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Categoria *</label>
                  <select className="form-select" name="categoria"
                    value={form.categoria} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Alimentação">🥣 Alimentação</option>
                    <option value="Medicamento">💊 Medicamento</option>
                    <option value="Acessório">🎀 Acessório</option>
                    <option value="Higiene">🧴 Higiene</option>
                    <option value="Brinquedo">🎾 Brinquedo</option>
                    <option value="Outro">📦 Outro</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Espécie</label>
                  <select className="form-select" name="especie"
                    value={form.especie} onChange={handleChange}>
                    <option value="">Todas as espécies</option>
                    <option value="Cachorro">🐕 Cachorro</option>
                    <option value="Gato">🐈 Gato</option>
                    <option value="Ave">🐦 Ave</option>
                    <option value="Roedor">🐹 Roedor</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Preço de Custo (R$) *</label>
                  <input type="number" step="0.01" className="form-control"
                    name="precoCusto" value={form.precoCusto}
                    onChange={handleChange} required min="0" placeholder="0.00" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Preço de Venda (R$) *</label>
                  <input type="number" step="0.01" className="form-control"
                    name="precoVenda" value={form.precoVenda}
                    onChange={handleChange} required min="0" placeholder="0.00" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Estoque Atual *</label>
                  <input type="number" className="form-control"
                    name="quantidadeEstoque" value={form.quantidadeEstoque}
                    onChange={handleChange} required min="0" placeholder="0" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Estoque Mínimo</label>
                  <input type="number" className="form-control"
                    name="estoqueMinimo" value={form.estoqueMinimo}
                    onChange={handleChange} min="0" placeholder="5" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Marca</label>
                  <input type="text" className="form-control" name="marca"
                    value={form.marca} onChange={handleChange} placeholder="Ex: Royal Canin" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fornecedor</label>
                  <input type="text" className="form-control" name="fornecedor"
                    value={form.fornecedor} onChange={handleChange} placeholder="Nome do fornecedor" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Código de Barras</label>
                  <input type="text" className="form-control" name="codigoBarras"
                    value={form.codigoBarras} onChange={handleChange} placeholder="0000000000000" />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Descrição</label>
                  <input type="text" className="form-control" name="descricao"
                    value={form.descricao} onChange={handleChange} placeholder="Descrição do produto..." />
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
                <th>Nome</th>
                <th>Categoria</th>
                <th>Espécie</th>
                <th>Preço Venda</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map(p => {
                  const ec = estoqueConfig(p.quantidadeEstoque, p.estoqueMinimo);
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.nome}</strong>
                        {p.marca && <small className="text-muted d-block">{p.marca}</small>}
                      </td>
                      <td>{categoriaEmoji[p.categoria] || '📦'} {p.categoria}</td>
                      <td style={{ color: '#666' }}>{p.especie || 'Todas'}</td>
                      <td><strong style={{ color: '#28a745' }}>R$ {parseFloat(p.precoVenda).toFixed(2)}</strong></td>
                      <td>
                        <span style={{
                          backgroundColor: ec.bg, color: ec.color,
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '600'
                        }}>{ec.label}</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => abrirEdicao(p)}>✏️ Editar</button>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletar(p.id)}>🗑️ Remover</button>
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

export default Produtos;