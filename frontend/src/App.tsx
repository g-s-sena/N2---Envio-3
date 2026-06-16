import { useState, useEffect } from 'react';

// ==========================================
// 1. TIPAGEM E DADOS GLOBAIS
// ==========================================
interface Pedido {
  id: string | number;
  cliente: string;
  servico: string;
  status?: string;
  horario?: string;
  obs?: string;
}

const cores = {
  fundo: '#F5F6F8', navy: '#0B1727', navyCard: '#1A2639',
  azul: '#3182CE', textoSuave: '#A0ABC0', textoCard: '#2D3748',
  verde: '#38A169', vermelho: '#E53E3E', amarelo: '#ECC94B'
};

const estiloAnimacao = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .animar-entrada { animation: fadeIn 0.4s ease-out forwards; }
  .toast { animation: slideDown 0.3s ease-out forwards; }
  .spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(49, 130, 206, 0.3); border-radius: 50%; border-top-color: #3182CE; animation: spin 1s ease-in-out infinite; }
`;

export default function App() {
  // Começa no login, a não ser que já exista um token guardado
  const [tela, setTela] = useState(localStorage.getItem('token_prestador') ? 'home' : 'login');
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState<{ visivel: boolean; mensagem: string; tipo: 'sucesso' | 'erro' }>({ visivel: false, mensagem: '', tipo: 'sucesso' });

  // Estado para os pedidos que vêm da API
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);

  // Efeito simples de loading ao trocar de ecrã
  useEffect(() => {
    if (tela !== 'login') {
      setCarregando(true);
      const timer = setTimeout(() => setCarregando(false), 300);
      return () => clearTimeout(timer);
    }
  }, [tela]);

  // Função Global de Notificação
  const mostrarNotificacao = (mensagem: string, tipo: 'sucesso' | 'erro') => {
    setNotificacao({ visivel: true, mensagem, tipo });
    setTimeout(() => setNotificacao({ visivel: false, mensagem: '', tipo: 'sucesso' }), 3000);
  };

  const fazerLogout = () => {
    localStorage.removeItem('token_prestador');
    setTela('login');
  };

  // ==========================================
  // 2. COMPONENTES COMPARTILHADOS
  // ==========================================
  const Toast = () => {
    if (!notificacao.visivel) return null;
    return (
      <div className="toast" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: notificacao.tipo === 'sucesso' ? cores.verde : cores.vermelho, color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px', width: 'max-content', maxWidth: '90%' }}>
        {notificacao.tipo === 'sucesso' ? '✓' : '✕'} {notificacao.mensagem}
      </div>
    );
  };

  const BottomNav = () => {
    if (tela === 'login') return null; // Não mostra barra de navegação no login
    
    return (
      <div style={{ backgroundColor: 'white', position: 'fixed', bottom: 0, width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #E2E8F0', zIndex: 100 }}>
        {[
          { id: 'home', icone: '🏠', label: 'Início' },
          { id: 'pedidos', icone: '📋', label: 'Pedidos' },
          { id: 'assinatura', icone: '💳', label: 'Planos' },
          { id: 'perfil', icone: '👤', label: 'Perfil' }
        ].map((item) => {
          const ativo = tela === item.id || (tela === 'ganhos' && item.id === 'perfil');
          return (
            <div key={item.id} onClick={() => setTela(item.id)} style={{ textAlign: 'center', cursor: 'pointer', color: ativo ? cores.azul : cores.textoSuave, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: ativo ? 1 : 0.6, filter: ativo ? 'none' : 'grayscale(100%)' }}>
              <span style={{ fontSize: '20px' }}>{item.icone}</span>
              <strong style={{ fontSize: '10px', color: ativo ? cores.azul : cores.textoSuave }}>{item.label}</strong>
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================
  // 3. TELAS DA APLICAÇÃO
  // ==========================================

  // --- NOVA TELA DE LOGIN ---
  const RenderLogin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregandoLogin, setCarregandoLogin] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setCarregandoLogin(true);

      try {
        const resposta = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          localStorage.setItem('token_prestador', dados.token);
          mostrarNotificacao('Login realizado com sucesso!', 'sucesso');
          setTela('home');
        } else {
          mostrarNotificacao(dados.erro || 'Erro ao fazer login.', 'erro');
        }
      } catch (error) {
        mostrarNotificacao('Erro de conexão com o servidor.', 'erro');
      } finally {
        setCarregandoLogin(false);
      }
    };

    return (
      <div className="animar-entrada" style={{ backgroundColor: cores.navy, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 30px', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '300', margin: 0, color: cores.azul }}>Nexxos</h1>
          <p style={{ color: cores.textoSuave, marginTop: '10px' }}>Portal de Serviços Profissionais</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', color: cores.textoSuave, marginBottom: '8px', display: 'block' }}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: cores.navyCard, color: 'white', boxSizing: 'border-box' }}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', color: cores.textoSuave, marginBottom: '8px', display: 'block' }}>Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: cores.navyCard, color: 'white', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" disabled={carregandoLogin} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: cores.azul, color: 'white', fontWeight: 'bold', fontSize: '16px', marginTop: '16px', cursor: carregandoLogin ? 'not-allowed' : 'pointer', opacity: carregandoLogin ? 0.7 : 1 }}>
            {carregandoLogin ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  };

  const RenderHome = () => (
    <div className="animar-entrada" style={{ backgroundColor: cores.fundo, minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: cores.navy, color: 'white', padding: '30px 20px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: cores.textoSuave }}>Olá, <strong>Profissional</strong> 🔧</p>
        <h1 style={{ margin: '5px 0 25px 0', fontSize: '28px', fontWeight: '300' }}>Nexxos</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: cores.navyCard, padding: '15px 10px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{Array.isArray(pedidosPendentes) ? pedidosPendentes.length : 0}</h2>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoSuave }}>Novas sol.</p>
          </div>
          <div style={{ backgroundColor: cores.navyCard, padding: '15px 10px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>R$480</h2>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoSuave }}>Este mês</p>
          </div>
          <div style={{ backgroundColor: cores.navyCard, padding: '15px 10px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>5.0</h2>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoSuave }}>Avaliação</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', color: cores.textoSuave, letterSpacing: '1px', margin: 0 }}>ATIVIDADES RECENTES</h3>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div>
            <strong style={{ display: 'block', color: cores.textoCard, fontSize: '15px', marginBottom: '4px' }}>Reparo Elétrico</strong>
            <span style={{ fontSize: '13px', color: cores.textoSuave }}>João Silva • 15 abr</span>
            <div style={{ marginTop: '10px' }}>
              <span style={{ backgroundColor: '#EBF8FF', color: cores.azul, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Em andamento</span>
            </div>
          </div>
          <div style={{ color: cores.azul, fontWeight: 'bold', fontSize: '16px' }}>R$ 120</div>
        </div>
      </div>
    </div>
  );

  const RenderPedidos = () => {
    // Busca os pedidos reais da API protegida
    useEffect(() => {
      const fetchPedidos = async () => {
        const token = localStorage.getItem('token_prestador');
        
        try {
          const resposta = await fetch('http://localhost:3000/pedidos', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (resposta.status === 401) {
            fazerLogout(); // Se o token for inválido, volta para o login
            return;
          }

          if (resposta.ok) {
            const dados = await resposta.json();
            
            // 🐛 DEBUG: Verifica o que a API devolve
            console.log("O que a API devolveu?", dados); 

            // 🛡️ PROTEÇÃO: Garante que só faz o filtro se for um array
            if (Array.isArray(dados)) {
              const aguardando = dados.filter((p: any) => p.status === 'Aguardando');
              setPedidosPendentes(aguardando);
            } else {
              console.error("A API não devolveu uma lista de pedidos!");
              setPedidosPendentes([]); // Resgata a aplicação para não quebrar a tela
            }
          }
        } catch (error) {
          console.error("Erro ao buscar pedidos", error);
          setPedidosPendentes([]); // Resgata em caso de erro de rede
        }
      };

      fetchPedidos();
    }, []);

    // Atualiza o pedido na API (aceitar ou recusar)
    const processarPedido = async (id: string | number, acao: 'aceitar' | 'recusar') => {
      const token = localStorage.getItem('token_prestador');
      
      try {
        const resposta = await fetch(`http://localhost:3000/pedidos/${id}/status`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ acao })
        });

        if (resposta.ok) {
          // Garante que só filtra se pedidosPendentes for um array válido
          if (Array.isArray(pedidosPendentes)) {
             setPedidosPendentes(pedidosPendentes.filter(p => p.id !== id));
          }
          mostrarNotificacao(acao === 'aceitar' ? 'Pedido aceite e agendado!' : 'Pedido recusado.', acao === 'aceitar' ? 'sucesso' : 'erro');
        } else {
          mostrarNotificacao('Erro ao processar o pedido.', 'erro');
        }
      } catch (error) {
        mostrarNotificacao('Erro de comunicação com o servidor.', 'erro');
      }
    };

    // Garante sempre que temos um array para avaliar
    const listaDePedidosSegura = Array.isArray(pedidosPendentes) ? pedidosPendentes : [];

    return (
      <div className="animar-entrada" style={{ padding: '24px 20px', backgroundColor: cores.fundo, minHeight: '100vh', paddingBottom: '80px' }}>
        <h2 style={{ color: cores.navy, marginBottom: '20px', fontSize: '24px' }}>Novas Solicitações</h2>
        
        {listaDePedidosSegura.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: cores.textoSuave }}>
            <div style={{ fontSize: '48px', opacity: 0.5, marginBottom: '10px' }}>✅</div>
            <p>Você não possui novas solicitações no momento.</p>
          </div>
        ) : (
          listaDePedidosSegura.map((pedido) => (
            <div key={pedido.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '18px', color: cores.textoCard }}>{pedido.cliente}</strong>
                <span style={{ backgroundColor: '#FEFCBF', color: '#B7791F', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{pedido.status || 'Aguardando'}</span>
              </div>
              <p style={{ fontSize: '14px', color: cores.textoSuave, margin: '8px 0' }}>{pedido.servico} {pedido.horario && `• ${pedido.horario}`}</p>
              {pedido.obs && (
                <div style={{ backgroundColor: cores.fundo, padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#718096', margin: '12px 0', fontStyle: 'italic' }}>
                  "{pedido.obs}"
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => processarPedido(pedido.id, 'aceitar')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: cores.verde, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  ✓ Aceitar
                </button>
                <button onClick={() => processarPedido(pedido.id, 'recusar')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid', borderColor: cores.vermelho, backgroundColor: 'white', color: cores.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>
                  ✕ Recusar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const RenderAssinatura = () => (
    <div className="animar-entrada" style={{ padding: '24px 20px', backgroundColor: cores.fundo, minHeight: '100vh', paddingBottom: '80px' }}>
      <h2 style={{ color: cores.navy, marginBottom: '24px' }}>Planos de Assinatura</h2>
      <p style={{ color: cores.textoSuave, fontSize: '14px', marginBottom: '20px' }}>Plano atual: Básico</p>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: `2px solid ${cores.azul}`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-12px', left: '20px', backgroundColor: cores.azul, color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
          ★ MAIS POPULAR
        </div>
        <h3 style={{ margin: '10px 0 5px 0', fontSize: '20px', color: cores.textoCard }}>Profissional</h3>
        <h1 style={{ margin: '0 0 20px 0', fontSize: '36px', color: cores.azul }}>R$ 49<span style={{ fontSize: '14px', color: cores.textoSuave }}> / mês</span></h1>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: cores.textoCard, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><span style={{ color: cores.verde, fontWeight: 'bold' }}>✓</span> Destaque nas buscas</li>
          <li><span style={{ color: cores.verde, fontWeight: 'bold' }}>✓</span> Pedidos ilimitados</li>
          <li><span style={{ color: cores.verde, fontWeight: 'bold' }}>✓</span> Comissão reduzida (10%)</li>
        </ul>
        <button style={{ width: '100%', padding: '14px', marginTop: '24px', backgroundColor: cores.azul, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Assinar agora</button>
      </div>
    </div>
  );

  const RenderPerfil = () => (
    <div className="animar-entrada" style={{ backgroundColor: cores.fundo, minHeight: '100vh', textAlign: 'center', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: cores.navy, height: '140px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}></div>
      <div style={{ marginTop: '-60px', padding: '0 20px' }}>
        <div style={{ width: '120px', height: '120px', backgroundColor: '#CBD5E0', borderRadius: '50%', margin: '0 auto', border: '6px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}></div>
        <h2 style={{ margin: '12px 0 4px 0', color: cores.textoCard, fontSize: '24px' }}>Área do Prestador</h2>
        <p style={{ color: cores.azul, fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>Profissional Autônomo</p>
      </div>

      <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => setTela('ganhos')} style={{ padding: '16px', backgroundColor: 'white', border: 'none', borderRadius: '16px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
          📈 Meus Ganhos
        </button>
        <button style={{ padding: '16px', backgroundColor: 'white', border: 'none', borderRadius: '16px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
          ⚙️ Configurações
        </button>
        <button onClick={fazerLogout} style={{ padding: '16px', backgroundColor: '#FFF5F5', border: 'none', borderRadius: '16px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', color: cores.vermelho, marginTop: '20px', cursor: 'pointer' }}>
          🚪 Sair da conta
        </button>
      </div>
    </div>
  );

  const RenderGanhos = () => (
    <div className="animar-entrada" style={{ backgroundColor: cores.navy, minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '24px 20px 40px 20px' }}>
        <button onClick={() => setTela('perfil')} style={{ background: 'none', border: 'none', color: cores.textoSuave, marginBottom: '30px', padding: 0, fontSize: '16px', cursor: 'pointer' }}>
          ⬅️ Voltar
        </button>
        <p style={{ margin: '0 0 8px 0', color: cores.textoSuave }}>Este Mês • 4 serviços</p>
        <h1 style={{ margin: 0, fontSize: '42px', fontWeight: 'bold' }}>R$ 480,00</h1>
      </div>
      <div style={{ backgroundColor: 'white', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', minHeight: '60vh', padding: '30px 20px', color: cores.textoCard }}>
        <h3 style={{ fontSize: '13px', color: cores.textoSuave, letterSpacing: '1px', marginBottom: '20px' }}>EXTRATO DE GANHOS</h3>
        {[
          { serv: 'Reparo Elétrico', cl: 'João S.', data: '15 abr', val: '+R$ 102,00' },
          { serv: 'Inst. Chuveiro', cl: 'Ana L.', data: '16 abr', val: '+R$ 127,50' },
          { serv: 'Troca Tomadas', cl: 'Maria L.', data: '12 abr', val: '+R$ 76,50' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #EDF2F7' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '15px' }}>{item.serv}</strong>
              <span style={{ fontSize: '13px', color: cores.textoSuave }}>{item.cl} • {item.data}</span>
            </div>
            <strong style={{ color: cores.verde, fontSize: '16px' }}>{item.val}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{estiloAnimacao}</style>
      <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', position: 'relative', backgroundColor: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
        <Toast />
        {carregando ? (
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {tela === 'login' && <RenderLogin />}
            {tela === 'home' && <RenderHome />}
            {tela === 'pedidos' && <RenderPedidos />}
            {tela === 'assinatura' && <RenderAssinatura />}
            {tela === 'perfil' && <RenderPerfil />}
            {tela === 'ganhos' && <RenderGanhos />}
          </>
        )}
        {tela !== 'ganhos' && tela !== 'login' && <BottomNav />}
      </div>
    </>
  );
}