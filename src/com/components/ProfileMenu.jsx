import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ongHome.css";

function ProfileMenu({ tipo, pessoa }) {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const nome = pessoa?.nome || (tipo === "ong" ? "ONG" : "Usuário");

  const inicialPerfil = nome ? nome.charAt(0).toUpperCase() : "?";

  const imagemPerfil = pessoa?.imagem || null;

  const irParaPerfil = () => {
    if (tipo === "ong") {
      navigate("/perfil-ong");
    } else {
      navigate("/perfil-usuario");
    }

    setMenuAberto(false);
  };

  const abrirConfirmacaoDesconectar = () => {
    setMenuAberto(false);
    setMostrarConfirmacao(true);
  };

  const confirmarDesconectar = () => {
    if (tipo === "ong") {
      localStorage.removeItem("ongLogada");
      localStorage.removeItem("ongId");
    } else {
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("usuarioId");
    }

    setMostrarConfirmacao(false);

    navigate("/");
  };

  return (
    <div className="profile-menu-wrapper">
      <button
        type="button"
        className="ong-profile-circle"
        onClick={() => setMenuAberto((prev) => !prev)}
      >
        {imagemPerfil ? (
          <img
            src={imagemPerfil}
            alt="Foto de perfil"
            className="profile-image"
          />
        ) : (
          <span>{inicialPerfil}</span>
        )}
      </button>

      {menuAberto && (
        <div className="profile-menu-popup">
          <button type="button" onClick={irParaPerfil}>
            Perfil
          </button>

          <button
            type="button"
            className="profile-menu-disconnect"
            onClick={abrirConfirmacaoDesconectar}
          >
            Desconectar
          </button>
        </div>
      )}

      {mostrarConfirmacao && (
        <div className="modal-background">
          <div className="modal-box profile-disconnect-modal">
            <h2>Desconectar</h2>

            <p>Tem certeza que deseja sair da sua conta?</p>

            <div className="profile-menu-confirm-buttons">
              <button type="button" onClick={confirmarDesconectar}>
                Sim, desconectar
              </button>

              <button
                type="button"
                onClick={() => setMostrarConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
