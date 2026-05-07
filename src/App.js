import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Pets from './pages/Pets';
import Agendamentos from './pages/Agendamentos';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import Dashboard from './pages/Dashboard';
import Funcionarios from './pages/Funcionarios';
import Login from './pages/Login';
import api from './services/api';

function MenuLateral({ usuario, onLogout }) {
  const location = useLocation();

  const menuItems = [
    { path: '/',             label: 'Dashboard',    icone: '📊' },
    { path: '/clientes',     label: 'Clientes',     icone: '👥' },
    { path: '/pets',         label: 'Pets',         icone: '🐾' },
    { path: '/agendamentos', label: 'Agendamentos', icone: '📅' },
    { path: '/produtos',     label: 'Produtos',     icone: '📦' },
    { path: '/vendas',       label: 'Vendas',       icone: '💰' },
    { path: '/funcionarios', label: 'Funcionários', icone: '👨‍⚕️' },
  ];

  return (
    <div style={{
      width: '220px',
      background: '#2D1A0E', // marrom escuro igual à referência
      position: 'fixed',
      height: '100vh',
      top: 0, left: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
    }}>

      {/* Logo */}
      <div style={{
        padding: '28px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h4 style={{
          color: 'white',
          fontSize: '1.6rem',
          fontWeight: '900',
          margin: 0,
          fontFamily: "'Fredoka One', cursive",
          letterSpacing: 1,
        }}>🐾 PetShop</h4>
        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '11px',
          display: 'block',
          marginTop: '2px',
          fontWeight: '500',
        }}>Sistema de Gestão</span>
      </div>

      {/* Menu — sem flex:1 para não espaçar */}
      <nav style={{ padding: '12px' }}>
        {menuItems.map(item => {
          const ativo = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', marginBottom: '4px',
              color: ativo ? '#fff' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none', fontSize: '14px',
              fontWeight: ativo ? '700' : '400',
              borderRadius: '10px',
              backgroundColor: ativo ? '#F97316' : 'transparent', // laranja igual referência
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!ativo) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!ativo) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span style={{ fontSize: '16px' }}>{item.icone}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Espaço flexível empurra o rodapé para baixo */}
      <div style={{ flex: 1 }} />

      {/* Rodapé — usuário + logout */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Avatar + nome + perfil */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#F97316',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {usuario?.nome?.charAt(0) || 'A'}
          </div>
          <div>
            <p style={{ margin: 0, color: 'white', fontSize: '13px', fontWeight: '700' }}>
              {usuario?.nome || 'Usuário'}
            </p>
            <span style={{
              background: '#F97316', color: 'white',
              padding: '1px 8px', borderRadius: '10px',
              fontSize: '10px', fontWeight: '700'
            }}>
              {usuario?.perfil || '—'}
            </span>
          </div>
        </div>

        {/* Botão sair */}
        <button
          onClick={onLogout}
          style={{
            width: '100%', padding: '8px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          🚪 Sair
        </button>

        <p style={{
          color: 'rgba(255,255,255,0.25)', fontSize: '11px',
          margin: '8px 0 0', textAlign: 'center'
        }}>
          PetShop v1.0 © 2026
        </p>
      </div>
    </div>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario({ token, perfil, nome, email });
    }
  }, []);

  const handleLogin = (dados) => { setUsuario(dados); };

  const handleLogout = () => {
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  if (!usuario) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <MenuLateral usuario={usuario} onLogout={handleLogout} />
      <div style={{
        marginLeft: '220px',
        backgroundColor: '#FDF6EC',
        minHeight: '100vh',
        padding: '32px'
      }}>
        <Routes>
          <Route path="/"             element={<Dashboard />}    />
          <Route path="/clientes"     element={<Clientes />}     />
          <Route path="/pets"         element={<Pets />}         />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/produtos"     element={<Produtos />}     />
          <Route path="/vendas"       element={<Vendas />}       />
          <Route path="/funcionarios" element={<Funcionarios />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;