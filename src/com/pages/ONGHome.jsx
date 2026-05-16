import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ongHome.css";

import heroImage from "../assets/login-image.png";
import donationPhoto from "../assets/donation-photo.jpg";

function ONGHome() {
  const navigate = useNavigate();
  const [mostrarNormas, setMostrarNormas] = useState(false);

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const nomeOng = ongLogada?.nome || "ONG";
  const cidadeOng = ongLogada?.localizacao || "Ceará";
  const inicialPerfil = nomeOng.charAt(0).toUpperCase();

  const irParaRodape = () => {
    const rodape = document.getElementById("rodape");

    if (rodape) {
      rodape.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="ong-home-page" id="topo">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <a href="#topo">Home</a>

          <button onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button onClick={irParaRodape}>Suporte</button>
        </div>

        <button
          className="ong-profile-circle"
          onClick={() => navigate("/perfil-ong")}
        >
          {ongLogada?.imagem ? (
            <img src={ongLogada.imagem} alt="Foto da ONG" />
          ) : (
            inicialPerfil
          )}
        </button>
      </nav>

      <section className="ong-hero">
        <div className="ong-hero-text">
          <p className="ong-location">
            {nomeOng} - {cidadeOng}
          </p>

          <h1>Conecte sua ONG a quem quer ajudar!</h1>

          <p>
            Publique suas necessidades em tempo real e permita que doadores
            encontrem exatamente o que sua instituição precisa no momento.
          </p>

          <button onClick={() => navigate("/publicar-necessidades")}>
            Publicar agora
          </button>
        </div>

        <div className="ong-hero-image">
          <img src={heroImage} alt="Ilustração de doação" />
        </div>
      </section>

      <section className="ong-info-section">
        <div className="ong-info-image">
          <img src={donationPhoto} alt="Doação de alimentos" />
        </div>

        <div className="ong-info-text">
          <p>Sua ONG • Doações direcionadas</p>

          <h2>Receba ajuda de forma mais eficiente</h2>

          <span>
            A plataforma permite que sua organização publique listas de
            necessidades atuais, evitando desperdícios e facilitando que os
            recursos cheguem mais rápido a quem realmente precisa.
          </span>
        </div>
      </section>

      <section className="ong-actions">
        <button
          className="action-card teal"
          onClick={() => navigate("/publicar-necessidades")}
        >
          <span>＋</span>
          Publicar necessidades
        </button>

        <button
          className="action-card blue"
          onClick={() => navigate("/necessidades-publicadas")}
        >
          <span>▣</span>
          Necessidades publicadas
        </button>

        <button
          className="action-card orange"
          onClick={() => navigate("/doacoes-recebidas")}
        >
          <span>✓</span>
          Doações recebidas
        </button>
      </section>

      <section className="thanks-section">
        <div className="thanks-text">
          <h2>Obrigado por fazer parte da nossa história!</h2>

          <p>
            Sua contribuição como ONG é essencial para conectar doadores às
            pessoas e instituições que realmente precisam de ajuda.
          </p>
        </div>

        <div className="thanks-illustration">
          <div className="heart heart-one"></div>
          <div className="heart heart-two"></div>
          <div className="box box-one"></div>
          <div className="box box-two"></div>
          <div className="box box-three">
            <span>Doação</span>
          </div>
        </div>
      </section>

      <footer className="ong-footer" id="rodape">
        <div className="footer-column">
          <h3>Links Rápidos</h3>

          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/publicar-necessidades")}>
            Publicar necessidades
          </button>
          <button onClick={() => navigate("/necessidades-publicadas")}>
            Necessidades publicadas
          </button>
        </div>

        <div className="footer-column">
          <h3>Ajuda</h3>

          <button onClick={() => setMostrarNormas(true)}>
            Dúvidas frequentes
          </button>
          <button>Comunidade</button>
          <button>Suporte</button>
        </div>

        <div className="footer-column">
          <h3>Termos e condições</h3>

          <button onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>
          <button>Termos legais</button>
        </div>

        <div className="footer-brand">
          <h2>+COM</h2>

          <div className="footer-icons">
            <span>☏</span>
            <span>◎</span>
            <span>✉</span>
          </div>
        </div>
      </footer>

      {mostrarNormas && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Normas do site</h2>

            <p>• Publique apenas necessidades reais da sua instituição.</p>

            <p>
              • Mantenha os pedidos atualizados conforme forem recebendo
              doações.
            </p>

            <p>• Não utilize informações falsas ou enganosas.</p>

            <p>• Remova pedidos que já foram atendidos.</p>

            <button onClick={() => setMostrarNormas(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ONGHome;