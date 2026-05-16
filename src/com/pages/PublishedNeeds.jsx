import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ongHome.css";
import "../styles/publishedNeeds.css";

function PublishedNeeds() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));
  const nomeOng = ongLogada?.nome || "ONG";
  const inicialPerfil = nomeOng.charAt(0).toUpperCase();

  const todasNecessidades =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const necessidadesDaOng = todasNecessidades.filter(
    (publicacao) => publicacao.ong.email === ongLogada?.email
  );

  const [necessidades, setNecessidades] = useState(necessidadesDaOng);

  const [doacoes, setDoacoes] = useState(
    JSON.parse(localStorage.getItem("doacoesRecebidas")) || []
  );

  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarDoacoes, setMostrarDoacoes] = useState(false);
  const [mostrarAcaoAposDoacao, setMostrarAcaoAposDoacao] = useState(false);
  const [mostrarEditarNecessidade, setMostrarEditarNecessidade] =
    useState(false);

  const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
  const [itensEditados, setItensEditados] = useState([]);

  const salvarDoacoes = (novaLista) => {
    localStorage.setItem("doacoesRecebidas", JSON.stringify(novaLista));
    setDoacoes(novaLista);
  };

  const salvarNecessidades = (novaListaGeral) => {
    localStorage.setItem(
      "necessidadesPublicadas",
      JSON.stringify(novaListaGeral)
    );

    const novaListaDaOng = novaListaGeral.filter(
      (publicacao) => publicacao.ong.email === ongLogada?.email
    );

    setNecessidades(novaListaDaOng);
  };

  const abrirDoacoes = (publicacao) => {
    setPublicacaoSelecionada(publicacao);
    setMostrarDoacoes(true);
  };

  const adicionarDoacaoTeste = (publicacao) => {
    const primeiroItem = publicacao.itens[0];

    const novaDoacao = {
      id: Date.now(),
      publicacaoId: publicacao.id,
      nomeDoador: "Doador teste",
      contato: "usuario@teste.com",
      mensagem: primeiroItem
        ? `Olá, posso doar ${primeiroItem.quantidade} de ${primeiroItem.nome}.`
        : "Olá, gostaria de ajudar com esta necessidade.",
      status: "Pendente",
      dataEnvio: new Date().toLocaleString("pt-BR"),
    };

    const listaAtualizada = [...doacoes, novaDoacao];

    salvarDoacoes(listaAtualizada);

    alert("Doação teste adicionada.");
  };

  const concluirDoacao = (doacao) => {
    setDoacaoSelecionada(doacao);
    setMostrarDoacoes(false);
    setMostrarAcaoAposDoacao(true);
  };

  const removerDoacaoConcluida = () => {
    const listaAtualizada = doacoes.filter(
      (doacao) => doacao.id !== doacaoSelecionada.id
    );

    salvarDoacoes(listaAtualizada);
  };

  const prepararEdicaoNecessidade = () => {
    removerDoacaoConcluida();

    setItensEditados(publicacaoSelecionada.itens);

    setMostrarAcaoAposDoacao(false);
    setMostrarEditarNecessidade(true);
  };

  const alterarItemEditado = (id, campo, valor) => {
    const novaLista = itensEditados.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [campo]: valor,
        };
      }

      return item;
    });

    setItensEditados(novaLista);
  };

  const removerItemEditado = (id) => {
    const novaLista = itensEditados.filter((item) => item.id !== id);
    setItensEditados(novaLista);
  };

  const salvarEdicaoNecessidade = () => {
    if (itensEditados.length === 0) {
      alert("A necessidade precisa ter pelo menos um item.");
      return;
    }

    const temCampoVazio = itensEditados.some(
      (item) => item.nome.trim() === "" || item.quantidade.trim() === ""
    );

    if (temCampoVazio) {
      alert("Preencha o nome e a quantidade de todos os itens.");
      return;
    }

    const necessidadesAtuais =
      JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

    const listaAtualizada = necessidadesAtuais.map((publicacao) => {
      if (publicacao.id === publicacaoSelecionada.id) {
        return {
          ...publicacao,
          itens: itensEditados,
          status: "Atualizado",
          dataAtualizacao: new Date().toLocaleString("pt-BR"),
        };
      }

      return publicacao;
    });

    salvarNecessidades(listaAtualizada);

    alert("Necessidade atualizada com sucesso!");

    setMostrarEditarNecessidade(false);
    setPublicacaoSelecionada(null);
    setDoacaoSelecionada(null);
  };

  const marcarNecessidadeSuprida = () => {
    removerDoacaoConcluida();

    const necessidadesAtuais =
      JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

    const listaAtualizada = necessidadesAtuais.filter(
      (publicacao) => publicacao.id !== publicacaoSelecionada.id
    );

    salvarNecessidades(listaAtualizada);

    alert("Necessidade marcada como suprida e removida da lista.");

    setMostrarAcaoAposDoacao(false);
    setPublicacaoSelecionada(null);
    setDoacaoSelecionada(null);
  };

  const removerPublicacao = (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover essa publicação?"
    );

    if (!confirmar) {
      return;
    }

    const necessidadesAtuais =
      JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

    const listaAtualizada = necessidadesAtuais.filter(
      (publicacao) => publicacao.id !== id
    );

    const doacoesAtualizadas = doacoes.filter(
      (doacao) => doacao.publicacaoId !== id
    );

    salvarNecessidades(listaAtualizada);
    salvarDoacoes(doacoesAtualizadas);
  };

  const doacoesDaPublicacaoSelecionada = publicacaoSelecionada
    ? doacoes.filter(
        (doacao) => doacao.publicacaoId === publicacaoSelecionada.id
      )
    : [];

  return (
    <div className="published-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button onClick={() => navigate("/home")}>Home</button>

          <button onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button onClick={() => navigate("/home")}>Suporte</button>
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

      <main className="published-main">
        <div className="published-header">
          <h1>Necessidades publicadas</h1>

          <button onClick={() => navigate("/publicar-necessidades")}>
            Nova publicação
          </button>
        </div>

        {necessidades.length === 0 ? (
          <div className="published-empty">
            <h2>Nenhuma necessidade publicada ainda.</h2>

            <p>
              Quando sua ONG publicar uma lista de necessidades, ela aparecerá
              aqui.
            </p>
          </div>
        ) : (
          <div className="published-list">
            {necessidades.map((publicacao) => {
              const quantidadeDoacoes = doacoes.filter(
                (doacao) => doacao.publicacaoId === publicacao.id
              ).length;

              return (
                <div className="published-card" key={publicacao.id}>
                  <div className="published-card-header">
                    <div>
                      <h2>{publicacao.ong.nome}</h2>
                      <p>{publicacao.dataPublicacao}</p>
                    </div>

                    <span>{publicacao.status}</span>
                  </div>

                  <div className="published-categories">
                    {publicacao.categorias.map((categoria) => (
                      <span key={categoria}>{categoria}</span>
                    ))}
                  </div>

                  <div className="published-items">
                    {publicacao.itens.map((item) => (
                      <div className="published-item" key={item.id}>
                        <strong>{item.nome}</strong>
                        <p>{item.quantidade}</p>
                      </div>
                    ))}
                  </div>

                  <div className="published-card-actions">
                    <button
                      className="donations-button"
                      onClick={() => abrirDoacoes(publicacao)}
                    >
                      Doações recebidas ({quantidadeDoacoes})
                    </button>

                    <button
                      className="fake-donation-button"
                      onClick={() => adicionarDoacaoTeste(publicacao)}
                    >
                      Adicionar doação teste
                    </button>

                    <button
                      className="remove-publication-button"
                      onClick={() => removerPublicacao(publicacao.id)}
                    >
                      Remover publicação
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {mostrarDoacoes && publicacaoSelecionada && (
        <div className="modal-background">
          <div className="modal-box donations-modal">
            <h2>Doações recebidas</h2>

            <p>
              Publicação: <strong>{publicacaoSelecionada.ong.nome}</strong>
            </p>

            {doacoesDaPublicacaoSelecionada.length === 0 ? (
              <p className="no-donations-message">
                Ainda não existem mensagens de doadores para esta necessidade.
              </p>
            ) : (
              <div className="donations-list">
                {doacoesDaPublicacaoSelecionada.map((doacao) => (
                  <div className="donation-message-card" key={doacao.id}>
                    <h3>{doacao.nomeDoador}</h3>

                    <p>{doacao.mensagem}</p>

                    <small>
                      Contato: {doacao.contato} • {doacao.dataEnvio}
                    </small>

                    <button onClick={() => concluirDoacao(doacao)}>
                      Concluir doação
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setMostrarDoacoes(false)}>Fechar</button>
          </div>
        </div>
      )}

      {mostrarAcaoAposDoacao && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Doação concluída</h2>

            <p>
              Agora atualize a necessidade publicada para manter os pedidos da
              ONG corretos.
            </p>

            <p>
              Escolha uma das opções abaixo:
            </p>

            <div className="after-donation-actions">
              <button onClick={prepararEdicaoNecessidade}>
                Editar necessidade
              </button>

              <button onClick={marcarNecessidadeSuprida}>
                Necessidade suprida
              </button>

              <button onClick={() => setMostrarAcaoAposDoacao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarEditarNecessidade && (
        <div className="modal-background">
          <div className="modal-box edit-need-modal">
            <h2>Editar necessidade</h2>

            <p>
              Atualize os itens após a doação recebida.
            </p>

            <div className="edit-items-list">
              {itensEditados.map((item) => (
                <div className="edit-item-row" key={item.id}>
                  <input
                    type="text"
                    value={item.nome}
                    onChange={(evento) =>
                      alterarItemEditado(item.id, "nome", evento.target.value)
                    }
                  />

                  <input
                    type="text"
                    value={item.quantidade}
                    onChange={(evento) =>
                      alterarItemEditado(
                        item.id,
                        "quantidade",
                        evento.target.value
                      )
                    }
                  />

                  <button onClick={() => removerItemEditado(item.id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="edit-modal-buttons">
              <button onClick={salvarEdicaoNecessidade}>
                Salvar atualização
              </button>

              <button onClick={() => setMostrarEditarNecessidade(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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

export default PublishedNeeds;