import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";
import "../styles/publishedNeeds.css";
import logoImg from "../assets/comm.png";

function PublishedNeeds() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const todasNecessidades =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const necessidadesDaOng = todasNecessidades.filter(
    (publicacao) => publicacao.ong.email === ongLogada?.email
  );

  const categoriasDisponiveis = [
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

  const [necessidades, setNecessidades] = useState(necessidadesDaOng);

  const [doacoes, setDoacoes] = useState(
    JSON.parse(localStorage.getItem("doacoesRecebidas")) || []
  );

  const [contribuicoesMonetarias, setContribuicoesMonetarias] = useState(
    JSON.parse(localStorage.getItem("contribuicoesMonetarias")) || []
  );

  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);
  const [mostrarDoacoes, setMostrarDoacoes] = useState(false);
  const [mostrarContribuicoes, setMostrarContribuicoes] = useState(false);
  const [mostrarAcaoAposDoacao, setMostrarAcaoAposDoacao] = useState(false);
  const [mostrarEditarNecessidade, setMostrarEditarNecessidade] =
    useState(false);
  const [mostrarConfirmarSuprida, setMostrarConfirmarSuprida] = useState(false);

  const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
  const [contribuicaoSelecionada, setContribuicaoSelecionada] = useState(null);
  const [tipoRegistroSelecionado, setTipoRegistroSelecionado] = useState("");

  const [itensEditados, setItensEditados] = useState([]);
  const [categoriasEditadas, setCategoriasEditadas] = useState([]);

  const salvarDoacoes = (novaLista) => {
    localStorage.setItem("doacoesRecebidas", JSON.stringify(novaLista));
    setDoacoes(novaLista);
  };

  const salvarContribuicoes = (novaLista) => {
    localStorage.setItem("contribuicoesMonetarias", JSON.stringify(novaLista));
    setContribuicoesMonetarias(novaLista);
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

  const abrirContribuicoes = (publicacao) => {
    setPublicacaoSelecionada(publicacao);
    setMostrarContribuicoes(true);
  };

  const concluirDoacao = (doacao) => {
    setDoacaoSelecionada(doacao);
    setContribuicaoSelecionada(null);
    setTipoRegistroSelecionado("doacao");

    setMostrarDoacoes(false);
    setMostrarAcaoAposDoacao(true);
  };

  const concluirContribuicao = (contribuicao) => {
    setContribuicaoSelecionada(contribuicao);
    setDoacaoSelecionada(null);
    setTipoRegistroSelecionado("contribuicao");

    setMostrarContribuicoes(false);
    setMostrarAcaoAposDoacao(true);
  };

  const removerRegistroConcluido = () => {
    if (tipoRegistroSelecionado === "doacao" && doacaoSelecionada) {
      const listaAtualizada = doacoes.filter(
        (doacao) => doacao.id !== doacaoSelecionada.id
      );

      salvarDoacoes(listaAtualizada);
    }

    if (tipoRegistroSelecionado === "contribuicao" && contribuicaoSelecionada) {
      const listaAtualizada = contribuicoesMonetarias.filter(
        (contribuicao) => contribuicao.id !== contribuicaoSelecionada.id
      );

      salvarContribuicoes(listaAtualizada);
    }
  };

  const prepararEdicaoNecessidade = () => {
    setItensEditados(publicacaoSelecionada.itens);
    setCategoriasEditadas(publicacaoSelecionada.categorias || []);

    setMostrarAcaoAposDoacao(false);
    setMostrarEditarNecessidade(true);
  };

  const cancelarEdicaoNecessidade = () => {
    setMostrarEditarNecessidade(false);
    setItensEditados([]);
    setCategoriasEditadas([]);

    setPublicacaoSelecionada(null);
    setDoacaoSelecionada(null);
    setContribuicaoSelecionada(null);
    setTipoRegistroSelecionado("");
  };

  const alterarCategoriaEditada = (categoria) => {
    if (categoriasEditadas.includes(categoria)) {
      setCategoriasEditadas(
        categoriasEditadas.filter((item) => item !== categoria)
      );
    } else {
      setCategoriasEditadas([...categoriasEditadas, categoria]);
    }
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
    if (categoriasEditadas.length === 0) {
      alert("A necessidade precisa ter pelo menos uma categoria.");
      return;
    }

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
          categorias: categoriasEditadas,
          itens: itensEditados,
          status: "Atualizado",
          dataAtualizacao: new Date().toLocaleString("pt-BR"),
        };
      }

      return publicacao;
    });

    salvarNecessidades(listaAtualizada);
    removerRegistroConcluido();

    alert("Necessidade atualizada com sucesso!");

    setMostrarEditarNecessidade(false);
    setPublicacaoSelecionada(null);
    setDoacaoSelecionada(null);
    setContribuicaoSelecionada(null);
    setTipoRegistroSelecionado("");
    setItensEditados([]);
    setCategoriasEditadas([]);
  };

  const abrirConfirmacaoNecessidadeSuprida = () => {
    setMostrarConfirmarSuprida(true);
  };

  const marcarNecessidadeSuprida = () => {
    const necessidadesAtuais =
      JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

    const listaAtualizada = necessidadesAtuais.filter(
      (publicacao) => publicacao.id !== publicacaoSelecionada.id
    );

    const doacoesAtualizadas = doacoes.filter(
      (doacao) => doacao.publicacaoId !== publicacaoSelecionada.id
    );

    const contribuicoesAtualizadas = contribuicoesMonetarias.filter(
      (contribuicao) => contribuicao.publicacaoId !== publicacaoSelecionada.id
    );

    salvarNecessidades(listaAtualizada);
    salvarDoacoes(doacoesAtualizadas);
    salvarContribuicoes(contribuicoesAtualizadas);

    alert("Necessidade marcada como suprida e removida da lista.");

    setMostrarConfirmarSuprida(false);
    setMostrarAcaoAposDoacao(false);
    setPublicacaoSelecionada(null);
    setDoacaoSelecionada(null);
    setContribuicaoSelecionada(null);
    setTipoRegistroSelecionado("");
  };

  const cancelarAcaoAposDoacao = () => {
    setMostrarAcaoAposDoacao(false);
    setDoacaoSelecionada(null);
    setContribuicaoSelecionada(null);
    setTipoRegistroSelecionado("");
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

    const contribuicoesAtualizadas = contribuicoesMonetarias.filter(
      (contribuicao) => contribuicao.publicacaoId !== id
    );

    salvarNecessidades(listaAtualizada);
    salvarDoacoes(doacoesAtualizadas);
    salvarContribuicoes(contribuicoesAtualizadas);
  };

  const formatarDataEntrega = (data) => {
    if (!data) {
      return "Data não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const doacoesDaPublicacaoSelecionada = publicacaoSelecionada
    ? doacoes.filter(
        (doacao) => doacao.publicacaoId === publicacaoSelecionada.id
      )
    : [];

  const contribuicoesDaPublicacaoSelecionada = publicacaoSelecionada
    ? contribuicoesMonetarias.filter(
        (contribuicao) =>
          contribuicao.publicacaoId === publicacaoSelecionada.id
      )
    : [];

  return (
    <div className="published-page">
      <nav className="ong-navbar">
              <a href="#topo" className="ong-logo">
                <img src={logoImg} alt="Logo +COM" />
              </a>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/home")}>
            Início
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <ProfileMenu tipo="ong" pessoa={ongLogada} />
      </nav>

      <main className="published-main">
        <div className="published-header">
          <h1>Necessidades publicadas</h1>

          <button
            type="button"
            onClick={() => navigate("/publicar-necessidades")}
          >
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

              const quantidadeContribuicoes = contribuicoesMonetarias.filter(
                (contribuicao) => contribuicao.publicacaoId === publicacao.id
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
                      type="button"
                      className="donations-button"
                      onClick={() => abrirDoacoes(publicacao)}
                    >
                      Doações recebidas ({quantidadeDoacoes})
                    </button>

                    <button
                      type="button"
                      className="monetary-contributions-button"
                      onClick={() => abrirContribuicoes(publicacao)}
                    >
                      Contribuições monetárias enviadas (
                      {quantidadeContribuicoes})
                    </button>

                    <button
                      type="button"
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
                    <h3>Mensagem de doação</h3>

                    <p>
                      <strong>Doador:</strong> {doacao.nomeDoador}
                    </p>

                    <p>
                      <strong>E-mail:</strong> {doacao.contato}
                    </p>

                    <div className="received-donation-items">
                      <strong>Itens que o doador pode doar:</strong>

                      {doacao.itensDoacao && doacao.itensDoacao.length > 0 ? (
                        doacao.itensDoacao.map((item) => (
                          <p key={item.id}>
                            {item.nome}: {item.quantidadeDoada} unidade(s)
                            <span>
                              {" "}
                              | Pedido original: {item.quantidadePedido}
                            </span>
                          </p>
                        ))
                      ) : (
                        <p>
                          {doacao.itemDoado || "Item não informado"} -{" "}
                          {doacao.quantidadeDoada || "Quantidade não informada"}
                        </p>
                      )}
                    </div>

                    <p>
                      <strong>Entrega:</strong>{" "}
                      {formatarDataEntrega(doacao.dataEntrega)} às{" "}
                      {doacao.horarioEntrega || "horário não informado"}
                    </p>

                    {doacao.observacoes && (
                      <p>
                        <strong>Observações:</strong> {doacao.observacoes}
                      </p>
                    )}

                    <small>Mensagem enviada em: {doacao.dataEnvio}</small>

                    <button
                      type="button"
                      onClick={() => concluirDoacao(doacao)}
                    >
                      Concluir doação
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => setMostrarDoacoes(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarContribuicoes && publicacaoSelecionada && (
        <div className="modal-background">
          <div className="modal-box donations-modal">
            <h2>Contribuições monetárias enviadas</h2>

            <p>
              Publicação: <strong>{publicacaoSelecionada.ong.nome}</strong>
            </p>

            <div className="monetary-warning-box">
              <strong>Aviso para a ONG:</strong>

              <p>
                Se a ONG receber uma doação em dinheiro referente a esta
                necessidade, o valor deve ser usado para suprir os pedidos
                publicados. Depois, verifique se a necessidade foi totalmente
                atendida ou se precisa ser atualizada, evitando pedidos
                repetidos e doações desnecessárias.
              </p>
            </div>

            {contribuicoesDaPublicacaoSelecionada.length === 0 ? (
              <p className="no-donations-message">
                Ainda não existem contribuições monetárias enviadas para esta
                necessidade.
              </p>
            ) : (
              <div className="donations-list">
                {contribuicoesDaPublicacaoSelecionada.map((contribuicao) => (
                  <div className="donation-message-card" key={contribuicao.id}>
                    <h3>Contribuição monetária</h3>

                    <p>
                      <strong>Doador:</strong> {contribuicao.nomeDoador}
                    </p>

                    <p>
                      <strong>E-mail:</strong> {contribuicao.contato}
                    </p>

                    <p>
                      <strong>Enviado em:</strong> {contribuicao.dataEnvio}
                    </p>

                    {contribuicao.mensagem && (
                      <p>
                        <strong>Mensagem:</strong> {contribuicao.mensagem}
                      </p>
                    )}

                    <div className="proof-view-box">
                      <strong>Comprovante enviado:</strong>

                      {contribuicao.comprovanteArquivo ? (
                        contribuicao.comprovanteTipo?.startsWith("image/") ? (
                          <img
                            src={contribuicao.comprovanteArquivo}
                            alt="Comprovante da contribuição"
                            className="proof-preview-image"
                          />
                        ) : (
                          <a
                            href={contribuicao.comprovanteArquivo}
                            download={
                              contribuicao.comprovanteNome || "comprovante"
                            }
                            className="proof-download-link"
                          >
                            Baixar comprovante
                          </a>
                        )
                      ) : (
                        <p>Comprovante não informado.</p>
                      )}

                      {contribuicao.comprovanteNome && (
                        <span>{contribuicao.comprovanteNome}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => concluirContribuicao(contribuicao)}
                    >
                      Concluir doação
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMostrarContribuicoes(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarAcaoAposDoacao && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>
              {tipoRegistroSelecionado === "contribuicao"
                ? "Contribuição monetária concluída"
                : "Doação concluída"}
            </h2>

            <p>
              Agora atualize a necessidade publicada para manter os pedidos da
              ONG corretos.
            </p>

            <p>Escolha uma das opções abaixo:</p>

            <div className="after-donation-actions">
              <button type="button" onClick={prepararEdicaoNecessidade}>
                Editar necessidade
              </button>

              <button
                type="button"
                onClick={abrirConfirmacaoNecessidadeSuprida}
              >
                Necessidade suprida
              </button>

              <button type="button" onClick={cancelarAcaoAposDoacao}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmarSuprida && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Confirmar necessidade suprida</h2>

            <p>
              Tem certeza que deseja marcar esta necessidade como suprida? Essa
              ação vai remover a publicação da lista de necessidades e apagar as
              mensagens/contribuições ligadas a ela.
            </p>

            <div className="after-donation-actions">
              <button type="button" onClick={marcarNecessidadeSuprida}>
                Sim, marcar como suprida
              </button>

              <button
                type="button"
                onClick={() => setMostrarConfirmarSuprida(false)}
              >
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
              Atualize as categorias e os itens após a doação recebida.
            </p>

            {doacaoSelecionada?.itensDoacao &&
              doacaoSelecionada.itensDoacao.length > 0 && (
                <div className="received-donation-items">
                  <strong>Itens informados pelo doador:</strong>

                  {doacaoSelecionada.itensDoacao.map((item) => (
                    <p key={item.id}>
                      {item.nome}: {item.quantidadeDoada} unidade(s)
                    </p>
                  ))}
                </div>
              )}

            {contribuicaoSelecionada && (
              <div className="received-donation-items">
                <strong>Contribuição monetária informada:</strong>

                <p>Doador: {contribuicaoSelecionada.nomeDoador}</p>

                <p>E-mail: {contribuicaoSelecionada.contato}</p>

                {contribuicaoSelecionada.mensagem && (
                  <p>Mensagem: {contribuicaoSelecionada.mensagem}</p>
                )}

                <p>
                  Comprovante:{" "}
                  {contribuicaoSelecionada.comprovanteNome ||
                    "Arquivo enviado"}
                </p>
              </div>
            )}

            <div className="edit-categories-section">
              <h3>Categorias da publicação</h3>

              <p>
                Desmarque as categorias que não fazem mais sentido para esta
                lista de necessidades.
              </p>

              <div className="edit-categories-grid">
                {categoriasDisponiveis.map((categoria) => (
                  <label
                    key={categoria}
                    className={
                      categoriasEditadas.includes(categoria)
                        ? "edit-category-option selected"
                        : "edit-category-option"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={categoriasEditadas.includes(categoria)}
                      onChange={() => alterarCategoriaEditada(categoria)}
                    />

                    <span>{categoria}</span>
                  </label>
                ))}
              </div>
            </div>

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

                  <button
                    type="button"
                    onClick={() => removerItemEditado(item.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="edit-modal-buttons">
              <button type="button" onClick={salvarEdicaoNecessidade}>
                Salvar atualização
              </button>

              <button type="button" onClick={cancelarEdicaoNecessidade}>
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

export default PublishedNeeds;