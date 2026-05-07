import React, { useState, useEffect } from 'react';
import api from '../services/api';

const C = {
  bg:     '#FDF6EC',
  orange: '#F97316',
  text:   '#1C0A00',
  muted:  '#92400E',
  white:  '#FFFFFF',
  border: '#F5E6D3',
  card1:  '#FDE68A',
  card2:  '#FECACA',
  card3:  '#BBF7D0',
  card4:  '#DDD6FE',
};

const STATUS_AG = {
  AGENDADO:  { bg: '#FEF9C3', color: '#854D0E', label: 'Agendado'  },
  CONCLUIDO: { bg: '#DCFCE7', color: '#166534', label: 'Concluído' },
  CANCELADO: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelado' },
};

const SERVICO_EMOJI = {
  'Banho': '🛁', 'Tosa': '✂️', 'Banho e Tosa': '🛁',
  'Consulta Veterinária': '🩺', 'Vacinação': '💉', 'Outro': '🔧'
};

function Avatar({ emoji, gradient, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.45, flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    }}>{emoji}</div>
  );
}

function Badge({ label, bg, color }) {
  return (
    <span style={{
      background: bg, color, padding: '3px 10px',
      borderRadius: 20, fontSize: 11, fontWeight: 700,
      letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function MetricCard({ label, valor, sub, emoji, bg, accent }) {
  return (
    <div style={{
      background: bg, borderRadius: 24,
      padding: '22px 20px 18px',
      position: 'relative', overflow: 'hidden',
      border: `2px solid ${accent}22`,
      minHeight: 140,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{
        position: 'absolute', right: -18, top: -18,
        width: 90, height: 90, borderRadius: '50%',
        background: `${accent}22`,
      }}/>
      <div style={{
        position: 'absolute', right: 10, bottom: -24,
        width: 70, height: 70, borderRadius: '50%',
        background: `${accent}15`,
      }}/>
      <div style={{
        position: 'absolute', right: 16, top: 16,
        fontSize: 36, opacity: 0.85,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
      }}>{emoji}</div>
      <div>
        <p style={{
          margin: '0 0 6px', fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1, color: accent,
        }}>{label}</p>
        <h2 style={{
          margin: '0 0 4px', fontWeight: 900,
          fontSize: '2rem', color: C.text,
          fontFamily: "'Fredoka One', cursive",
        }}>{valor}</h2>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{sub}</p>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.white, borderRadius: 24,
      boxShadow: '0 2px 20px rgba(120,60,0,0.07)',
      border: `1.5px solid ${C.border}`,
      overflow: 'hidden', ...style,
    }}>{children}</div>
  );
}

function CardHeader({ title, count }) {
  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: `1.5px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <h6 style={{ margin: 0, fontWeight: 800, color: C.text, fontSize: 15 }}>{title}</h6>
      {count !== undefined && (
        <span style={{
          background: C.bg, color: C.muted,
          padding: '3px 10px', borderRadius: 20,
          fontSize: 12, fontWeight: 600,
        }}>Últimos {count}</span>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState({
    totalClientes: 0, totalPets: 0, agendamentosHoje: 0,
    receitaHoje: 0, estoqueBaixo: [], ultimosAgendamentos: [], ultimasVendas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resClientes, resPets, resAg, resVendas, resProd] = await Promise.all([
        api.get('/clientes'), api.get('/pets'), api.get('/agendamentos'),
        api.get('/vendas'), api.get('/produtos')
      ]);
      const hoje = new Date().toDateString();
      const agHoje = resAg.data.filter(a => a.dataHora && new Date(a.dataHora).toDateString() === hoje);
      const receitaHoje = resVendas.data
        .filter(v => v.status === 'FINALIZADA' && new Date(v.dataHora).toDateString() === hoje)
        .reduce((s, v) => s + (v.total || 0), 0);
      setDados({
        totalClientes: resClientes.data.length,
        totalPets: resPets.data.length,
        agendamentosHoje: agHoje.length,
        receitaHoje,
        estoqueBaixo: resProd.data.filter(p => p.quantidadeEstoque <= p.estoqueMinimo),
        ultimosAgendamentos: resAg.data.slice(0, 4),
        ultimasVendas: resVendas.data.slice(0, 4)
      });
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const formatarHora = (dh) => {
    if (!dh) return '—';
    return new Date(dh).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: 16,
    }}>
      <div className="spinner-border" style={{ color: C.orange }} />
      <p style={{ color: C.muted, fontWeight: 600 }}>Carregando...</p>
    </div>
  );

  const metricas = [
    { label: 'Agendamentos Hoje', valor: dados.agendamentosHoje, sub: 'atendimentos marcados', emoji: '📅', bg: C.card1, accent: '#D97706' },
    { label: 'Receita Hoje', valor: `R$ ${dados.receitaHoje.toFixed(2)}`, sub: 'em vendas finalizadas', emoji: '🐾', bg: C.card2, accent: '#DC2626' },
    { label: 'Total de Clientes', valor: dados.totalClientes, sub: 'clientes cadastrados', emoji: '👥', bg: C.card3, accent: '#16A34A' },
    { label: 'Total de Pets', valor: dados.totalPets, sub: 'pets cadastrados', emoji: '🦴', bg: C.card4, accent: '#7C3AED' },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Fontes do Google */}
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Saudação */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontWeight: 900, fontSize: '2rem', color: C.text, margin: 0,
          fontFamily: "'Fredoka One', cursive", letterSpacing: 0.5,
        }}>
          {saudacao}! 🐾
        </h2>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 14, fontWeight: 600 }}>
          Aqui está o resumo do seu pet shop —{' '}
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Cards métricas */}
      <div className="row g-3 mb-4">
        {metricas.map((m, i) => (
          <div className="col-6 col-xl-3" key={i}>
            <MetricCard {...m} />
          </div>
        ))}
      </div>

      {/* Segunda linha */}
      <div className="row g-3">

        {/* Agendamentos */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader title="📅 Agendamentos" count={dados.ultimosAgendamentos.length} />
            {dados.ultimosAgendamentos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 36, color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                <p style={{ margin: 0, fontWeight: 600 }}>Nenhum agendamento ainda.</p>
              </div>
            ) : dados.ultimosAgendamentos.map((ag, i) => {
              const sc = STATUS_AG[ag.status] || STATUS_AG.AGENDADO;
              return (
                <div key={ag.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < dados.ultimosAgendamentos.length - 1 ? `1.5px solid ${C.border}` : 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Avatar emoji={SERVICO_EMOJI[ag.tipoServico] || '🐾'} gradient="linear-gradient(135deg, #FDE68A, #F97316)" />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.text }}>{ag.pet?.nome}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 600 }}>{ag.tipoServico} · {ag.funcionario?.nome}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <p style={{ margin: 0, fontSize: 13, color: C.text, fontWeight: 800 }}>{formatarHora(ag.dataHora)}</p>
                    <Badge label={sc.label} bg={sc.bg} color={sc.color} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Coluna direita */}
        <div className="col-12 col-lg-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Estoque Baixo */}
          {dados.estoqueBaixo.length > 0 && (
            <Card style={{ borderLeft: `5px solid ${C.orange}` }}>
              <div style={{
                padding: '16px 20px', borderBottom: `1.5px solid ${C.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h6 style={{ margin: 0, fontWeight: 800, color: C.text, fontSize: 15 }}>⚠️ Estoque Baixo</h6>
                <Badge label={`${dados.estoqueBaixo.length} produto${dados.estoqueBaixo.length > 1 ? 's' : ''}`} bg="#FEF9C3" color="#854D0E" />
              </div>
              {dados.estoqueBaixo.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: i < dados.estoqueBaixo.length - 1 ? `1.5px solid ${C.border}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar emoji="📦" gradient="linear-gradient(135deg, #FDE68A, #F97316)" size={38} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.text }}>{p.nome}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 600 }}>{p.categoria}</p>
                    </div>
                  </div>
                  <Badge
                    label={`${p.quantidadeEstoque} un.`}
                    bg={p.quantidadeEstoque <= 0 ? '#FEE2E2' : '#FEF9C3'}
                    color={p.quantidadeEstoque <= 0 ? '#991B1B' : '#854D0E'}
                  />
                </div>
              ))}
            </Card>
          )}

          {/* Últimas Vendas */}
          <Card>
            <CardHeader title="💰 Últimas Vendas" count={dados.ultimasVendas.length} />
            {dados.ultimasVendas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 36, color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
                <p style={{ margin: 0, fontWeight: 600 }}>Nenhuma venda ainda.</p>
              </div>
            ) : dados.ultimasVendas.map((v, i) => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: i < dados.ultimasVendas.length - 1 ? `1.5px solid ${C.border}` : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar emoji="💰" gradient="linear-gradient(135deg, #BBF7D0, #16A34A)" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.text }}>{v.cliente?.nome}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 600 }}>Venda #{v.id} · {v.formaPagamento || '—'}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <p style={{ margin: 0, fontWeight: 800, color: '#16A34A', fontSize: 15 }}>
                    R$ {parseFloat(v.total || 0).toFixed(2)}
                  </p>
                  <Badge
                    label={v.status}
                    bg={v.status === 'FINALIZADA' ? '#DCFCE7' : '#FEE2E2'}
                    color={v.status === 'FINALIZADA' ? '#166534' : '#991B1B'}
                  />
                </div>
              </div>
            ))}
          </Card>

        </div>
      </div>
    </div>
  );
}