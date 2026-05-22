import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ongHome.css";
import "../styles/userHome.css";

import heroImage from "../assets/login-image.png";

function UserHome() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const nomeUsuario = usuarioLogado?.nome || "Usuário";
  const inicialPerfil = nomeUsuario.charAt(0).toUpperCase();

  const [pesquisa, setPesquisa] = useState("");

  const categorias = [
    "Alimentos",
    "Produtos de limpeza",
    "Roupas",
    "Brinquedos",
    "Higiene pessoal",
    "Material escolar",
    "Medicamentos",
    "Móveis e utensílios",
    "Ração animal",
    "Outros",
  ];

  const necessidadesPublicadas =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const necessidadesFiltradas = necessidadesPublicadas.filter((publicacao) =>
    publicacao.ong.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const ongsEncontradas = necessidadesFiltradas.reduce((lista, publicacao) => {
    const ongJaExiste = lista.find(
      (ong) => ong.email === publicacao.ong.email
    );

    if (ongJaExiste) {
      ongJaExiste.quantidadePedidos += 1;
      return lista;
    }

    lista.push({
      nome: publicacao.ong.nome,
      email: publicacao.ong.email,
      quantidadePedidos: 1,
    });

    return lista;
  }, []);

  const buscarPorCategoria = (categoria) => {
    return necessidadesFiltradas.filter((publicacao) =>
      publicacao.categorias.includes(categoria)
    );
  };

  return (
    <div className="user-home-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button type="button">Home</button>
          <button type="button">Necessidades disponíveis</button>
          <button type="button">Suporte</button>
        </div>

        <button
          type="button"
          className="ong-profile-circle"
          onClick={() => navigate("/perfil-usuario")}
        >
          {usuarioLogado?.imagem ? (
            <img src={usuarioLogado.imagem} alt="Foto do usuário" />
          ) : (
            inicialPerfil
          )}
        </button>
      </nav>

      <section className="user-hero-section">
        <div className="user-hero-text">
          <p>{usuarioLogado?.localizacao || "Quixadá - CE"}</p>

          <h1>Conheça o Projeto +Com!</h1>

          <span>
            Encontre ONGs que precisam de ajuda e contribua com doações
            direcionadas de forma simples, rápida e solidária.
          </span>

          <button type="button">Saiba mais</button>
        </div>

        <div className="user-hero-image">
          <img src={heroImage} alt="Ilustração de doações" />
        </div>
      </section>

      <main className="user-main-content">
        <section className="search-section">
          <h2>ONGs para ajudar</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar ONG..."
              value={pesquisa}
              onChange={(evento) => setPesquisa(evento.target.value)}
            />

            <button type="button">Pesquisar</button>
          </div>

          {pesquisa.trim() !== "" && (
            <div className="search-results">
              {ongsEncontradas.length === 0 ? (
                <p>Nenhuma ONG com pedidos encontrada.</p>
              ) : (
                ongsEncontradas.map((ong) => (
                  <div className="ong-search-result" key={ong.email}>
                    <strong>{ong.nome}</strong>
                    <span>
                      {ong.quantidadePedidos} pedido(s) publicado(s)
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {categorias.map((categoria) => {
          const publicacoesDaCategoria = buscarPorCategoria(categoria);

          if (publicacoesDaCategoria.length === 0) {
            return null;
          }

          return (
            <section className="category-carousel-section" key={categoria}>
              <h2>{categoria}</h2>

              <div className="category-carousel">
                {publicacoesDaCategoria.map((publicacao) => (
                  <div className="user-need-card" key={publicacao.id}>
                    <div className="user-need-image">
                      {publicacao.ong.imagem ? (
                        <img
                          src={publicacao.ong.imagem}
                          alt={publicacao.ong.nome}
                        />
                      ) : (
                        <div className="user-need-placeholder">
                          {publicacao.ong.nome.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="user-need-info">
                      <h3>{publicacao.ong.nome}</h3>

                      <p className="user-need-location">
                        {publicacao.ong.localizacao}
                      </p>

                      <div className="user-need-items">
                        {publicacao.itens.map((item) => (
                          <p key={item.id}>
                            <strong>{item.nome}</strong> - {item.quantidade}
                          </p>
                        ))}
                      </div>

                      <div className="user-need-buttons">
                        <button
                          type="button"
                          onClick={() => navigate(`/doar/${publicacao.id}`)}
                        >
                          Doar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/contribuir/${publicacao.id}`)
                          }
                        >
                          Contribuir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {necessidadesPublicadas.length === 0 && (
          <div className="no-needs-user">
            <h2>Nenhuma necessidade publicada ainda.</h2>
            <p>
              Quando as ONGs publicarem pedidos, eles aparecerão aqui para os
              doadores.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserHome;