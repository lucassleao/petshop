import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [vendaAberta, setVendaAberta] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resVendas, resClientes, resProdutos] = await Promise.all([
        api.get('/vendas'), api.get('/clientes'), api.get('/produtos')
      ]);
      setVendas(resVendas.data);
      setClientes(resClientes.data);
      setProdutos(resProdutos.data);
      setErro('');
    } catch { setErro('Erro ao carregar dados.'); }
  };

  const abrirVenda = async () => {
    if (!clienteId) { setErro('Selecione um cliente.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/vendas', { cliente: { id: parseInt(clienteId) } });
      setVendaAberta(res.data);
      setErro('');
    } catch { setErro('Erro ao abrir venda.'); }
    finally { setLoading(false); }
  };

  const adicionarItem = async () => {
    if (!produtoId || quantidade < 1) { setErro('Selecione produto e quantidade.'); return; }
    setLoading(true);
    try {
      const res = await api.post(`/vendas/${vendaAberta.id}/itens?produtoId=${produtoId}&quantidade=${quantidade}`);
      setVendaAberta(res.data);
      setProdutoId('');
      setQuantidade(1);
      setErro('');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao adicionar item.');
    } finally { setLoading(false); }
  };

  const finalizarVenda = async () => {
    if (!formaPagamento) { setErro('Selecione a forma de pagamento.'); return; }
    setLoading(true);
    try {
      await api.post(`/vendas/${vendaAberta.id}/finalizar?formaPagamento=${formaPagamento}`);
      setVendaAberta(null);
      setMostrarForm(false);
      setClienteId('');
      setFormaPagamento('');
      carregarDados();
    } catch { setErro('Erro ao finalizar venda.'); }
    finally { setLoading(false); }
  };

  const cancelarVenda = async (id) => {
    if (!window.confirm('Cancelar esta venda?')) return;
    try { await api.post(`/vendas/${id}/cancelar`); carregarDados(); }
    catch { setErro('Erro ao cancelar venda.'); }
  };

  const statusConfig = {
    'FINALIZADA': { bg: '#d1e7dd', color: '#0f5132' },
    'CANCELADA':  { bg: '#f8d7da', color: '#842029' },
    'ABERTA':     { bg: '#fff3cd', color: '#856404' },
  };

  const pagamentoEmoji = {
    'DINHEIRO': '💵', 'CARTAO_CREDITO': '💳', 'CARTAO_DEBITO': '💳', 'PIX': '📱'
  };

  const formatarData = (data) => {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR') + ' ' +
      new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">💰 Vendas</h2>
        <button className="btn btn-primary" onClick={() => {
          setMostrarForm(true); setVendaAberta(null); setClienteId('');
        }}>+ Nova Venda</button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {mostrarForm && (
        <div className="card mb-4">
          <div className="card-header" style={{ background: '#f8f9fa' }}>
            💰 Nova Venda
          </div>
          <div className="card-body" style={{ padding: '24px' }}>

            {/* Passo 1 — Seleciona cliente */}
            {!vendaAberta && (
              <div>
                <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                  <strong>Passo 1:</strong> Selecione o cliente
                </p>
                <div className="row g-3 align-items-end">
                  <div className="col-md-6">
                    <label className="form-label">Cliente *</label>
                    <select className="form-select" value={clienteId}
                      onChange={(e) => setClienteId(e.target.value)}>
                      <option value="">Selecione o cliente...</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-success w-100"
                      onClick={abrirVenda} disabled={loading}>
                      {loading ? 'Abrindo...' : '▶️ Iniciar Venda'}
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-secondary w-100"
                      onClick={() => setMostrarForm(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Passo 2 — Adiciona itens */}
            {vendaAberta && (
              <div>
                <div className="alert alert-success" style={{ borderRadius: '10px' }}>
                  ✅ Venda <strong>#{vendaAberta.id}</strong> aberta para <strong>{vendaAberta.cliente?.nome}</strong>
                </div>

                <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                  <strong>Passo 2:</strong> Adicione os produtos
                </p>

                <div className="row g-3 align-items-end mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Produto</label>
                    <select className="form-select" value={produtoId}
                      onChange={(e) => setProdutoId(e.target.value)}>
                      <option value="">Selecione o produto...</option>
                      {produtos.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — R$ {parseFloat(p.precoVenda).toFixed(2)} ({p.quantidadeEstoque} un.)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Qtd</label>
                    <input type="number" className="form-control" min="1"
                      value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100"
                      onClick={adicionarItem} disabled={loading}>
                      ➕ Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de itens */}
                {vendaAberta.itens && vendaAberta.itens.length > 0 && (
                  <div className="card mb-4" style={{ border: '1px solid #e9ecef' }}>
                    <table className="table table-sm mb-0">
                      <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                          <th>Produto</th>
                          <th>Qtd</th>
                          <th>Preço Unit.</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendaAberta.itens.map((item, i) => (
                          <tr key={i}>
                            <td>{item.produto?.nome}</td>
                            <td>{item.quantidade}</td>
                            <td>R$ {parseFloat(item.precoUnitario).toFixed(2)}</td>
                            <td><strong>R$ {parseFloat(item.subtotal).toFixed(2)}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot style={{ background: '#1a1a2e', color: 'white' }}>
                        <tr>
                          <td colSpan="3"><strong>Total da Venda</strong></td>
                          <td><strong>R$ {parseFloat(vendaAberta.total || 0).toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Passo 3 — Finaliza */}
                <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                  <strong>Passo 3:</strong> Escolha a forma de pagamento e finalize
                </p>
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Forma de Pagamento *</label>
                    <select className="form-select" value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}>
                      <option value="">Selecione...</option>
                      <option value="DINHEIRO">💵 Dinheiro</option>
                      <option value="CARTAO_CREDITO">💳 Cartão de Crédito</option>
                      <option value="CARTAO_DEBITO">💳 Cartão de Débito</option>
                      <option value="PIX">📱 Pix</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-success w-100"
                      onClick={finalizarVenda} disabled={loading}>
                      {loading ? 'Finalizando...' : '✅ Finalizar Venda'}
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-danger w-100"
                      onClick={() => cancelarVenda(vendaAberta.id)}>
                      ❌ Cancelar Venda
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Total</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    Nenhuma venda registrada.
                  </td>
                </tr>
              ) : (
                vendas.map(v => {
                  const sc = statusConfig[v.status] || statusConfig['ABERTA'];
                  return (
                    <tr key={v.id}>
                      <td style={{ color: '#aaa', fontSize: '12px' }}>#{v.id}</td>
                      <td><strong>{v.cliente?.nome}</strong></td>
                      <td style={{ color: '#666', fontSize: '13px' }}>{formatarData(v.dataHora)}</td>
                      <td><strong style={{ color: '#28a745' }}>R$ {parseFloat(v.total || 0).toFixed(2)}</strong></td>
                      <td>{pagamentoEmoji[v.formaPagamento]} {v.formaPagamento?.replace('_', ' ') || '—'}</td>
                      <td>
                        <span style={{
                          backgroundColor: sc.bg, color: sc.color,
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '600'
                        }}>{v.status}</span>
                      </td>
                      <td>
                        {v.status === 'ABERTA' && (
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelarVenda(v.id)}>❌ Cancelar</button>
                        )}
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

export default Vendas;