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

  // Modal states
  const [ongSelecionada, setOngSelecionada] = useState(null);
  const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
  const [mostrarDetalhesOng, setMostrarDetalhesOng] = useState(false);
  const [mostrarContribuicao, setMostrarContribuicao] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [valorSelecionado, setValorSelecionado] = useState(null);

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

  const abrirDetalhesOng = (publicacao) => {
    setPublicacaoSelecionada(publicacao);
    setOngSelecionada(publicacao.ong);
    setMostrarDetalhesOng(true);
  };

  const fecharDetalhesOng = () => {
    setMostrarDetalhesOng(false);
    setOngSelecionada(null);
    setPublicacaoSelecionada(null);
  };

  const abrirContribuicao = (publicacao) => {
    setPublicacaoSelecionada(publicacao);
    setOngSelecionada(publicacao.ong);
    setValorSelecionado(null);
    setMostrarDetalhesOng(false);
    setMostrarContribuicao(true);
  };

  const confirmarContribuicao = () => {
    if (!valorSelecionado) {
      alert("Selecione um valor para contribuir.");
      return;
    }

    if (!usuarioLogado) {
      alert("Você precisa estar logado para contribuir.");
      navigate("/");
      return;
    }

    const contribuicoesSalvas =
      JSON.parse(localStorage.getItem("contribuicoesMonetarias")) || [];

    const novaContribuicao = {
      id: Date.now(),
      publicacaoId: publicacaoSelecionada?.id || null,
      nomeOng: ongSelecionada?.nome || "",
      nomeDoador: usuarioLogado.nome,
      emailDoador: usuarioLogado.email,
      valor: valorSelecionado,
      data: new Date().toLocaleDateString("pt-BR"),
      status: "Comprovado",
    };

    const listaAtualizada = [...contribuicoesSalvas, novaContribuicao];
    localStorage.setItem(
      "contribuicoesMonetarias",
      JSON.stringify(listaAtualizada)
    );

    setMostrarContribuicao(false);
    setMostrarSucesso(true);
  };

  const fecharSucesso = () => {
    setMostrarSucesso(false);
    setValorSelecionado(null);
    setPublicacaoSelecionada(null);
    setOngSelecionada(null);
  };

  const valoresContribuicao = [5, 10, 25, 50];

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

                      <p className="user-need-description">
                        {publicacao.ong.sobre
                          ? publicacao.ong.sobre.substring(0, 120) +
                            (publicacao.ong.sobre.length > 120 ? "..." : "")
                          : "Organização dedicada a ajudar quem mais precisa."}
                      </p>

                      <div className="user-need-buttons">
                        <button
                          type="button"
                          className="btn-pedidos"
                          onClick={() => abrirDetalhesOng(publicacao)}
                        >
                          Pedidos
                        </button>

                        <button
                          type="button"
                          className="btn-contribuir"
                          onClick={() => abrirContribuicao(publicacao)}
                        >
                          <span className="contribuir-icon">$</span> Contribuir
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

      {/* Modal: Detalhes da ONG */}
      {mostrarDetalhesOng && ongSelecionada && publicacaoSelecionada && (
        <div className="modal-background" onClick={fecharDetalhesOng}>
          <div
            className="modal-box modal-ong-details"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={fecharDetalhesOng}
            >
              ×
            </button>

            <p className="modal-label">Detalhes de ONG</p>

            <div className="modal-ong-header">
              <div className="modal-ong-image">
                {ongSelecionada.imagem ? (
                  <img src={ongSelecionada.imagem} alt={ongSelecionada.nome} />
                ) : (
                  <div className="modal-ong-placeholder">
                    {ongSelecionada.nome.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="modal-ong-info">
                <h2>{ongSelecionada.nome}</h2>
                <p>
                  {ongSelecionada.sobre ||
                    "O projeto atua no combate à insegurança alimentar, distribuindo alimentos para famílias em situação de vulnerabilidade. Sua contribuição ajuda a levar dignidade, nutrição e esperança para quem mais precisa."}
                </p>

                <div className="modal-ong-actions">
                  <button
                    type="button"
                    className="btn-pedidos"
                    onClick={() => {
                      fecharDetalhesOng();
                      navigate(`/doar/${publicacaoSelecionada.id}`);
                    }}
                  >
                    Pedidos
                  </button>

                  <button
                    type="button"
                    className="btn-contribuir"
                    onClick={() => abrirContribuicao(publicacaoSelecionada)}
                  >
                    <span className="contribuir-icon">$</span> Contribuir
                  </button>
                </div>

                <p className="modal-disclaimer">
                  *A Contribuição serve para doar dinheiro à ONG a qualquer
                  momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Contribuição monetária */}
      {mostrarContribuicao && ongSelecionada && (
        <div
          className="modal-background"
          onClick={() => setMostrarContribuicao(false)}
        >
          <div
            className="modal-box modal-contribuicao"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setMostrarContribuicao(false)}
            >
              ×
            </button>

            <h2>Contribuir monetariamente</h2>

            <div className="valores-grid">
              {valoresContribuicao.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  className={`valor-btn ${
                    valorSelecionado === valor ? "valor-btn-selecionado" : ""
                  }`}
                  onClick={() => setValorSelecionado(valor)}
                >
                  <span className="valor-cifrao">R$</span>
                  <span className="valor-numero">
                    {valor}
                    <span className="valor-centavos">,00</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn-confirmar-contribuicao"
              onClick={confirmarContribuicao}
            >
              Contribuir
            </button>
          </div>
        </div>
      )}

      {/* Modal: Sucesso */}
      {mostrarSucesso && (
        <div className="modal-background" onClick={fecharSucesso}>
          <div
            className="modal-box modal-sucesso"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={fecharSucesso}
            >
              ×
            </button>

            <div className="sucesso-icon">✓</div>

            <h2>Obrigado pela ajuda!</h2>
            <p>Sua contribuição é de suma importância para a ONG.</p>

            <button
              type="button"
              className="btn-pornada"
              onClick={fecharSucesso}
            >
              Por nada!
            </button>

            <button
              type="button"
              className="btn-fechar-sucesso"
              onClick={fecharSucesso}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;