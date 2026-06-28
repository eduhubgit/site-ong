import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

import "../styles/ongHome.css";
import "../styles/publishedNeeds.css";
import logoImg from "../assets/comm.png";

function PublishedNeeds() {
  const navigate = useNavigate();
  const [ongLogada, setOngLogada] = useState(null);
  const [necessidades, setNecessidades] = useState([]);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [necessidadeSelecionada, setNecessidadeSelecionada] = useState(null);
  const [categoriasEditadas, setCategoriasEditadas] = useState([]);
  const [itensEditados, setItensEditados] = useState([]);
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

  // CARREGAR ONG + NECESSIDADES
  useEffect(() => {
    const carregarDados = async () => {
      const id = localStorage.getItem("ongId");

      if (!id) {
        navigate("/");

        return;
      }
      const respostaOng = await fetch(`http://localhost:3001/ongs/${id}`);
      if (!respostaOng.ok) {
        alert("Erro ao carregar ONG");
        return;
      }

      const ong = await respostaOng.json();
      setOngLogada(ong);
      const respostaNecessidades = await fetch(
        "http://localhost:3001/necessidades",
      );

      const todas = await respostaNecessidades.json();
      const minhas = todas.filter(
        (necessidade) => necessidade.ongId._id === ong._id,
      );

      setNecessidades(minhas);
    };

    carregarDados();
  }, [navigate]);

  // ABRIR EDIÇÃO

  const editarNecessidade = (necessidade) => {
    setNecessidadeSelecionada(necessidade);
    setCategoriasEditadas(necessidade.categorias);
    setItensEditados(necessidade.itens);
    setMostrarEditar(true);
  };

  // ALTERAR CATEGORIA

  const alterarCategoria = (categoria) => {
    if (categoriasEditadas.includes(categoria)) {
      setCategoriasEditadas(
        categoriasEditadas.filter((item) => item !== categoria),
      );
    } else {
      setCategoriasEditadas([...categoriasEditadas, categoria]);
    }
  };

  // ALTERAR ITEM

  const alterarItem = (id, campo, valor) => {
    const novaLista = itensEditados.map((item) => {
      if (item._id === id || item.id === id) {
        return {
          ...item,

          [campo]: valor,
        };
      }

      return item;
    });

    setItensEditados(novaLista);
  };

  // SALVAR EDIÇÃO NO MONGO

  const salvarEdicao = async () => {
    console.log("ID:", necessidadeSelecionada._id);
    await fetch(
      `http://localhost:3001/necessidades/${necessidadeSelecionada._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorias: categoriasEditadas,
          itens: itensEditados,
          status: "Atualizado",
        }),
      },
    );

    alert("Necessidade atualizada!");
    setMostrarEditar(false);
    window.location.reload();
  };

  // DELETAR

  const removerNecessidade = async (id) => {
    const confirmar = window.confirm("Deseja remover essa necessidade?");
    if (!confirmar) return;
    await fetch(`http://localhost:3001/necessidades/${id}`, {
      method: "DELETE",
    });
    alert("Necessidade removida");
    window.location.reload();
  };

  return (
    <div className="published-page">
      <nav className="ong-navbar">
        <a href="#topo" className="ong-logo">
          <img src={logoImg} alt="Logo +COM" />
        </a>

        <div className="ong-nav-links">
          <button onClick={() => navigate("/ong-home")}>Início</button>

          <button onClick={() => navigate("/publicar-necessidades")}>
            Nova necessidade
          </button>
        </div>

        <ProfileMenu tipo="ong" pessoa={ongLogada} />
      </nav>

      <main className="published-main">
        <h1>Necessidades publicadas</h1>

        {necessidades.length === 0 ? (
          <div className="published-empty">
            <h2>Nenhuma necessidade publicada.</h2>
          </div>
        ) : (
          <div className="published-list">
            {necessidades.map((necessidade) => (
              <div className="published-card" key={necessidade._id}>
                <div className="published-card-header">
                  <h2>{ongLogada?.nome}</h2>
                  <span>{necessidade.status}</span>
                </div>

                <div className="published-categories">
                  {necessidade.categorias.map((categoria) => (
                    <span key={categoria}>{categoria}</span>
                  ))}
                </div>

                <div className="published-items">
                  {necessidade.itens.map((item) => (
                    <div key={item._id || item.id} className="published-item">
                      <strong>{item.nome}</strong>
                      <p>{item.quantidade}</p>
                    </div>
                  ))}
                </div>

                <div className="published-card-actions">
                  <button onClick={() => editarNecessidade(necessidade)}>
                    Editar
                  </button>

                  <button
                    className="remove-publication-button"
                    onClick={() => removerNecessidade(necessidade._id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {mostrarEditar && (
        <div className="modal-background">
          <div className="modal-box edit-need-modal">
            <h2>Editar necessidade</h2>

            <div className="edit-categories-grid">
              {categoriasDisponiveis.map((categoria) => (
                <label key={categoria}>
                  <input
                    type="checkbox"
                    checked={categoriasEditadas.includes(categoria)}
                    onChange={() => alterarCategoria(categoria)}
                  />
                  {categoria}
                </label>
              ))}
            </div>

            <div className="edit-items-list">
              {itensEditados.map((item) => (
                <div key={item._id || item.id} className="edit-item-row">
                  <input
                    value={item.nome}
                    onChange={(e) =>
                      alterarItem(item._id || item.id, "nome", e.target.value)
                    }
                  />

                  <input
                    value={item.quantidade}
                    onChange={(e) =>
                      alterarItem(
                        item._id || item.id,
                        "quantidade",
                        e.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div className="edit-modal-buttons">
              <button onClick={salvarEdicao}>Salvar</button>

              <button onClick={() => setMostrarEditar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublishedNeeds;
