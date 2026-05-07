import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const res = await api.post('/auth/login', form);
      const { token, perfil, nome, email } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('perfil', perfil);
      localStorage.setItem('nome', nome);
      localStorage.setItem('email', email);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLogin({ token, perfil, nome, email });

    } catch (err) {
      setErro(err.response?.data?.erro || 'Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F97316', // laranja quente igual à referência
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Nunito', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Círculos decorativos de fundo */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        top: -100, left: -100,
      }}/>
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        bottom: -80, right: -80,
      }}/>
      <div style={{
        position: 'absolute', width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        top: '40%', right: '10%',
      }}/>

      {/* Card principal */}
      <div style={{
        background: 'white',
        borderRadius: '28px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🐾</div>
          <h2 style={{
            color: '#2D1A0E',
            fontWeight: '900',
            margin: 0,
            fontSize: '2rem',
            fontFamily: "'Fredoka One', cursive",
            letterSpacing: 1,
          }}>PetShop</h2>
          <p style={{
            color: '#92400E',
            margin: '4px 0 0',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            Sistema de Gestão
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '20px',
            fontWeight: '600',
          }}>
            ❌ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '700',
              color: '#2D1A0E', display: 'block', marginBottom: '6px'
            }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ borderRadius: 12, padding: '12px 16px', fontSize: 14 }}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '700',
              color: '#2D1A0E', display: 'block', marginBottom: '6px'
            }}>
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              required
              style={{ borderRadius: 12, padding: '12px 16px', fontSize: 14 }}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : '#F97316',
              border: 'none',
              borderRadius: '14px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(249,115,22,0.4)',
              transition: 'all 0.2s',
              fontFamily: "'Fredoka One', cursive",
              letterSpacing: 0.5,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Entrando...' : '🔐 Entrar'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', color: '#92400E',
          fontSize: '12px', marginTop: '24px',
          marginBottom: 0, fontWeight: '600',
        }}>
          PetShop v1.0 © 2026
        </p>
      </div>
    </div>
  );
}

export default Login;