import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ongHome.css";
import "../styles/createNeed.css";

function CreateNeed() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const nomeOng = ongLogada?.nome || "ONG";
  const inicialPerfil = nomeOng.charAt(0).toUpperCase();

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

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [itens, setItens] = useState([]);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarNormas, setMostrarNormas] = useState(false);

  const alterarCategoria = (categoria) => {
    if (categoriasSelecionadas.includes(categoria)) {
      setCategoriasSelecionadas(
        categoriasSelecionadas.filter((item) => item !== categoria)
      );
    } else {
      setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
    }
  };

  const adicionarItem = () => {
    if (nomeItem.trim() === "" || quantidade.trim() === "") {
      alert("Preencha a necessidade e a quantidade antes de adicionar.");
      return;
    }

    const novoItem = {
      id: Date.now(),
      nome: nomeItem.trim(),
      quantidade: quantidade.trim(),
    };

    setItens([...itens, novoItem]);

    setNomeItem("");
    setQuantidade("");
  };

  const removerItem = (id) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const abrirConfirmacao = () => {
    if (categoriasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma categoria antes de publicar a necessidade.");
      return;
    }

    if (itens.length === 0) {
      alert("Adicione pelo menos uma necessidade antes de publicar.");
      return;
    }

    setMostrarConfirmacao(true);
  };

  const publicarNecessidades = () => {
    if (!ongLogada) {
      alert("Você precisa estar logado como ONG para publicar necessidades.");
      navigate("/");
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      alert("Não é possível publicar sem selecionar uma categoria.");
      setMostrarConfirmacao(false);
      return;
    }

    if (itens.length === 0) {
      alert("Não é possível publicar sem adicionar pelo menos uma necessidade.");
      setMostrarConfirmacao(false);
      return;
    }

    const necessidadesSalvas =
      JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

    const novaPublicacao = {
      id: Date.now(),

      ong: {
        nome: ongLogada.nome,
        email: ongLogada.email,
        cnpj: ongLogada.cnpj,
        localizacao: ongLogada.localizacao,
        nicho: ongLogada.nicho,
        imagem: ongLogada.imagem || "",
      },

      categorias: categoriasSelecionadas,
      itens: itens,
      status: "Publicado",
      dataPublicacao: new Date().toLocaleString("pt-BR"),
    };

    const listaAtualizada = [...necessidadesSalvas, novaPublicacao];

    localStorage.setItem(
      "necessidadesPublicadas",
      JSON.stringify(listaAtualizada)
    );

    alert("Necessidades publicadas com sucesso!");

    setCategoriasSelecionadas([]);
    setItens([]);
    setNomeItem("");
    setQuantidade("");
    setMostrarConfirmacao(false);

    navigate("/necessidades-publicadas");
  };

  return (
    <div className="create-need-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/home")}>
            Home
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button">Suporte</button>
        </div>

        <button
          type="button"
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

      <main className="create-need-main">
        <section className="create-need-left">
          <h1>Do que sua ONG precisa?</h1>

          <p className="create-need-subtitle">
            Selecione as categorias e adicione os itens que sua instituição
            precisa receber no momento.
          </p>

          <div className="category-section">
            <h2>Categorias</h2>

            <div className="category-grid">
              {categorias.map((categoria) => (
                <label
                  key={categoria}
                  className={
                    categoriasSelecionadas.includes(categoria)
                      ? "category-option selected"
                      : "category-option"
                  }
                >
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(categoria)}
                    onChange={() => alterarCategoria(categoria)}
                  />

                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="need-form">
            <div className="need-input-group">
              <label>Necessidade</label>
              <input
                type="text"
                placeholder="Ex: Detergente"
                value={nomeItem}
                onChange={(evento) => setNomeItem(evento.target.value)}
              />
            </div>

            <div className="need-input-group">
              <label>Quantidade</label>
              <input
                type="text"
                placeholder="Ex: 10 unidades"
                value={quantidade}
                onChange={(evento) => setQuantidade(evento.target.value)}
              />
            </div>

            <button
              type="button"
              className="add-need-button"
              onClick={adicionarItem}
            >
              ADD
            </button>
          </div>
        </section>

        <section className="create-need-right">
          <div className="needs-list-card">
            <h2>Lista de necessidades</h2>

            {itens.length === 0 ? (
              <p className="empty-list">
                Nenhuma necessidade adicionada ainda.
              </p>
            ) : (
              <ul>
                {itens.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.nome}</strong>
                      <span>{item.quantidade}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerItem(item.id)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="publish-button"
              onClick={abrirConfirmacao}
              disabled={
                categoriasSelecionadas.length === 0 || itens.length === 0
              }
            >
              Publicar
            </button>
          </div>
        </section>
      </main>

      {mostrarConfirmacao && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Confirmar publicação</h2>

            <p>
              Você confirma que essas necessidades são reais, atuais e
              representam o que sua ONG realmente precisa neste momento?
            </p>

            <p>
              Ao publicar informações falsas, a ONG poderá comprometer a
              confiança dos doadores e o bom funcionamento da plataforma.
            </p>

            <div className="confirm-buttons">
              <button type="button" onClick={publicarNecessidades}>
                Sim, publicar
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
    </div>
  );
}

export default CreateNeed;