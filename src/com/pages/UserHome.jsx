import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";
import "../styles/userHome.css";
import logoImg from "../assets/comm.png";
import mascoteSorrindo from "../assets/sorrindo.png";

import heroImage from "../assets/login-image.png";

function UserHome() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [pesquisa, setPesquisa] = useState("");
  const [mostrarPix, setMostrarPix] = useState(false);
  const [publicacaoPix, setPublicacaoPix] = useState(null);
  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);
  const [mostrarSaibaMais, setMostrarSaibaMais] = useState(false);

  const [comprovante, setComprovante] = useState(null);
  const [mensagemContribuicao, setMensagemContribuicao] = useState("");

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
      (publicacao.categorias || []).includes(categoria)
    );
  };

  const irParaTopo = () => {
    const topo = document.getElementById("topo-usuario");

    if (topo) {
      topo.scrollIntoView({ behavior: "smooth" });
    }
  };

  const abrirPix = (publicacao) => {
    setPublicacaoPix(publicacao);
    setMostrarPix(true);
    setComprovante(null);
    setMensagemContribuicao("");
  };

  const fecharPix = () => {
    setPublicacaoPix(null);
    setMostrarPix(false);
    setComprovante(null);
    setMensagemContribuicao("");
  };

  const copiarPix = async () => {
    const chavePix = publicacaoPix?.ong?.chavePix;

    if (!chavePix) {
      alert("Esta ONG ainda não informou uma chave Pix.");
      return;
    }

    try {
      await navigator.clipboard.writeText(chavePix);
      alert("Chave Pix copiada!");
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível copiar automaticamente. Copie manualmente.");
    }
  };

  const carregarComprovante = (evento) => {
    const arquivo = evento.target.files[0];

    if (!arquivo) {
      setComprovante(null);
      return;
    }

    if (arquivo.size > 1000000) {
      alert("O comprovante é muito grande. Escolha um arquivo menor que 1MB.");
      evento.target.value = "";
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      setComprovante({
        nome: arquivo.name,
        tipo: arquivo.type,
        arquivo: leitor.result,
      });
    };

    leitor.readAsDataURL(arquivo);
  };

  const enviarContribuicaoMonetaria = () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado como usuário para enviar uma contribuição.");
      navigate("/");
      return;
    }

    if (!publicacaoPix) {
      alert("Publicação não encontrada.");
      return;
    }

    if (!comprovante) {
      alert("Envie o comprovante da contribuição antes de confirmar.");
      return;
    }

    const contribuicoesSalvas =
      JSON.parse(localStorage.getItem("contribuicoesMonetarias")) || [];

    const novaContribuicao = {
      id: Date.now(),
      publicacaoId: publicacaoPix.id,

      nomeDoador: usuarioLogado.nome,
      contato: usuarioLogado.email,
      imagemDoador: usuarioLogado.imagem || "",

      ongNome: publicacaoPix.ong.nome,
      ongEmail: publicacaoPix.ong.email,

      comprovanteNome: comprovante.nome,
      comprovanteTipo: comprovante.tipo,
      comprovanteArquivo: comprovante.arquivo,

      mensagem: mensagemContribuicao.trim(),

      status: "Pendente",
      dataEnvio: new Date().toLocaleString("pt-BR"),
    };

    const listaAtualizada = [...contribuicoesSalvas, novaContribuicao];

    localStorage.setItem(
      "contribuicoesMonetarias",
      JSON.stringify(listaAtualizada)
    );

    alert("Comprovante enviado para a ONG com sucesso!");

    fecharPix();
  };

  return (
    <div className="user-home-page" id="topo-usuario">
      <nav className="ong-navbar">
        <a href="#topo" className="ong-logo">
                  <img src={logoImg} alt="Logo +COM" />
                </a>

        <div className="ong-nav-links">
          <button type="button" onClick={irParaTopo}>
            Início
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do Site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <ProfileMenu tipo="usuario" pessoa={usuarioLogado} />
      </nav>

      <section className="user-hero-section">
        <div className="user-hero-text">
          <p>{usuarioLogado?.localizacao || "Quixadá - CE"}</p>

          <h1>Conheça o Projeto +Com!</h1>

          <span>
            Encontre ONGs que precisam de ajuda e contribua com doações
            direcionadas de forma simples, rápida e solidária.
          </span>

          <button type="button" onClick={() => setMostrarSaibaMais(true)}>
            Saiba mais
          </button>
        </div>

        <div className="user-hero-image">
          <img src={mascoteSorrindo} alt="Ilustração de doações" />
        </div>
      </section>

      <main className="user-main-content">
        <section className="donor-guide-section">
          <h2>Como ajudar uma ONG?</h2>

          <p>
            Para fazer uma doação, visualize os pedidos publicados pelas ONGs,
            veja se você pode doar os itens solicitados e escolha a melhor forma
            de ajudar. Caso prefira, você pode contribuir com dinheiro usando a
            chave Pix da instituição. Se quiser levar a doação pessoalmente,
            envie sua mensagem informando o que pode doar, escolha uma data e
            siga as{" "}
            <button
              type="button"
              className="rules-link-button"
              onClick={() => setMostrarNormas(true)}
            >
              regras do site
            </button>
            .
          </p>
        </section>

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
                        {publicacao.ong.cidade ||
                          publicacao.ong.localizacao ||
                          "Cidade não informada"}
                      </p>

                      <p className="user-need-description">
                        {publicacao.ong.sobre ||
                          "Organização dedicada a ajudar quem mais precisa."}
                      </p>

                      <div className="user-card-items-list">
                        <h4>Pedidos da ONG</h4>

                        {publicacao.itens.map((item) => (
                          <div className="user-card-item" key={item.id}>
                            <strong>{item.nome}</strong>
                            <span>{item.quantidade}</span>
                          </div>
                        ))}
                      </div>

                      <div className="user-need-buttons">
                        <button
                          type="button"
                          className="btn-pedidos"
                          onClick={() => navigate(`/doar/${publicacao.id}`)}
                        >
                          Doar
                        </button>

                        <button
                          type="button"
                          className="btn-contribuir"
                          onClick={() => abrirPix(publicacao)}
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

      <footer className="ong-footer" id="rodape-usuario">
        <div className="footer-column">
          <h3>Links Rápidos</h3>

          <button type="button" onClick={irParaTopo}>
            Início
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do Site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
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

      {mostrarPix && publicacaoPix && (
        <div className="modal-background" onClick={fecharPix}>
          <div
            className="modal-box pix-modal"
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={fecharPix}
            >
              ×
            </button>

            <h2>Contribuir para {publicacaoPix.ong.nome}</h2>

            <p>
              Para contribuir com dinheiro, copie a chave Pix abaixo e realize a
              transferência pelo aplicativo do seu banco.
            </p>

            <div className="pix-key-box">
              <strong>Chave Pix:</strong>

              <span>
                {publicacaoPix.ong.chavePix || "Chave Pix não informada"}
              </span>
            </div>

            <button type="button" onClick={copiarPix}>
              Copiar chave Pix
            </button>

            <div className="monetary-proof-section">
              <h3>Envio do comprovante</h3>

              <p>
                Caso tenha enviado dinheiro para ajudar, envie o comprovante
                para a ONG saber que essa contribuição se refere a esta
                necessidade publicada.
              </p>

              <label className="monetary-file-label">
                Comprovante da contribuição
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={carregarComprovante}
                />
              </label>

              {comprovante && (
                <p className="proof-file-name">
                  Arquivo selecionado: <strong>{comprovante.nome}</strong>
                </p>
              )}

              <label className="monetary-message-label">
                Caso queira, envie uma mensagem para a ONG:
                <textarea
                  placeholder="Ex: Enviei uma contribuição para ajudar nesta necessidade."
                  value={mensagemContribuicao}
                  onChange={(evento) =>
                    setMensagemContribuicao(evento.target.value)
                  }
                ></textarea>
              </label>

              <button
                type="button"
                className="send-proof-button"
                onClick={enviarContribuicaoMonetaria}
              >
                Enviar comprovante para ONG
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarSaibaMais && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Sobre o Projeto +Com</h2>

            <p>
              O Projeto +Com foi criado para aproximar doadores e ONGs de uma
              forma mais organizada, direta e consciente. A ideia principal é
              permitir que cada ONG publique exatamente aquilo que está
              precisando no momento, evitando doações aleatórias que podem não
              ser úteis naquele período.
            </p>

            <p>
              Em vez de receber muitos itens repetidos ou materiais que não
              fazem parte da necessidade atual, a ONG pode informar suas
              demandas reais, como alimentos, produtos de limpeza, roupas,
              materiais escolares, itens de higiene ou outros recursos
              importantes.
            </p>

            <p>
              Dessa forma, o doador consegue visualizar pedidos concretos,
              escolher aquilo que realmente pode doar e contribuir de maneira
              mais eficiente. O objetivo é reduzir desperdícios, facilitar a
              comunicação entre doadores e instituições e fazer com que a ajuda
              chegue de forma mais rápida a quem precisa.
            </p>

            <button type="button" onClick={() => setMostrarSaibaMais(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarNormas && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Normas do Site para Doadores</h2>

            <p>
              • Cumpra com sua palavra sobre os itens que você informou que iria
              doar.
            </p>

            <p>
              • Evite enviar mensagens de doação caso você não tenha certeza de
              que conseguirá realizar a entrega.
            </p>

            <p>
              • Entregue as doações em até 3 dias úteis depois de enviar a
              mensagem de doação.
            </p>

            <p>
              • Caso você deixe de entregar doações em até 3 mensagens
              diferentes, e passe 2 dias do prazo definido na mensagem, você
              poderá ser banido da plataforma.
            </p>

            <p>
              • Quando entregar a doação para a ONG, relembre a instituição de
              atualizar a necessidade publicada e confirmar que o pedido foi
              recebido.
            </p>

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

export default UserHome;