import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";
import heroImage from "../assets/login-image.png";
import donationPhoto from "../assets/donation-photo.jpg";
import logoImg from "../assets/comm.png";
import meninaFoto from "../assets/menina.png";
import mascoteJr from "../assets/mascote.png";
import lapisJr from "../assets/lapis.png";
import coracaoJr from "../assets/coracao.png";

function ONGHome() {
  const navigate = useNavigate();

  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const nomeOng = ongLogada?.nome || "ONG";
  const cidadeOng = ongLogada?.cidade || ongLogada?.localizacao || "Ceará";

  return (
    <div className="ong-home-page" id="topo">
      <nav className="ong-navbar">
        <a href="#topo" className="ong-logo">
          <img src={logoImg} alt="Logo +COM" />
        </a>

        <div className="ong-nav-links">
          <a href="#topo">Início</a>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <ProfileMenu tipo="ong" pessoa={ongLogada} />
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

          <button
            type="button"
            onClick={() => navigate("/publicar-necessidades")}
          >
            Publicar agora
          </button>
        </div>

        <div className="ong-hero-image">
          <img src={mascoteJr} alt="Ilustração de doação" />
        </div>
      </section>

      <section className="ong-info-section">
        <div className="ong-info-image">
          <img src={meninaFoto} alt="Doação de alimentos" />
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
          type="button"
          onClick={() => navigate("/publicar-necessidades")}
        >
          <img src={lapisJr} alt="Lápis" className="action-icon" />
          Publicar necessidades
        </button>

        <button
          className="action-card blue"
          type="button"
          onClick={() => navigate("/necessidades-publicadas")}
        >
          <img src={coracaoJr} alt="Coração" className="action-icon" />
          Necessidades publicadas
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

          <button type="button" onClick={() => navigate("/ong-home")}>
            Início
          </button>

          <button
            type="button"
            onClick={() => navigate("/publicar-necessidades")}
          >
            Publicar necessidades
          </button>

          <button
            type="button"
            onClick={() => navigate("/necessidades-publicadas")}
          >
            Necessidades publicadas
          </button>
        </div>

        <div className="footer-column">
          <h3>Ajuda</h3>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Dúvidas frequentes
          </button>

          <button type="button">Comunidade</button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <div className="footer-column">
          <h3>Termos e condições</h3>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button">Termos legais</button>
        </div>

        <div className="footer-brand">
          <a href="#topo" className="ong-logo">
            <img src={logoImg} alt="Logo +COM" />
          </a>

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

            <button type="button" onClick={() => setMostrarNormas(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarSuporte && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Suporte</h2>

            <p>
              Caso tenha algum problema com nossa plataforma, entre em contato
              conosco:
            </p>

            <p>
              <strong>EMAIL:</strong> maiscom@gmail.com
            </p>

            <p>
              <strong>Número:</strong> 4002-8922
            </p>

            <button type="button" onClick={() => setMostrarSuporte(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ONGHome;
