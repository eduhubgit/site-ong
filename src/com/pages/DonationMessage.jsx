import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";
import "../styles/userHome.css";
import logoImg from "../assets/comm.png";

function DonationMessage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const buscarUsuario = async () => {
      const id = localStorage.getItem("usuarioId");

      if (!id) {
        alert("Você precisa estar logado");
        navigate("/");
        return;
      }

      const resposta = await fetch(`http://localhost:3001/usuarios/${id}`);
      const dados = await resposta.json();

      setUsuarioLogado(dados);
    };

    buscarUsuario();
  }, []);

  const necessidadesPublicadas =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const publicacao = necessidadesPublicadas.find(
    (item) => String(item.id) === String(id),
  );

  const [quantidadesDoacao, setQuantidadesDoacao] = useState({});
  const [dataEntrega, setDataEntrega] = useState("");
  const [horarioEntrega, setHorarioEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatarDataInput = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const adicionarDiasUteis = (dataInicial, quantidadeDias) => {
    const data = new Date(dataInicial);
    let diasAdicionados = 0;

    while (diasAdicionados < quantidadeDias) {
      data.setDate(data.getDate() + 1);

      const diaDaSemana = data.getDay();

      if (diaDaSemana !== 0 && diaDaSemana !== 6) {
        diasAdicionados += 1;
      }
    }

    return data;
  };

  const dataAtual = new Date();
  const dataMinima = formatarDataInput(dataAtual);
  const dataMaxima = formatarDataInput(adicionarDiasUteis(dataAtual, 3));

  const alterarQuantidade = (idItem, valor) => {
    const numero = Number(valor);

    if (numero < 0) {
      return;
    }

    setQuantidadesDoacao({
      ...quantidadesDoacao,
      [idItem]: numero,
    });
  };

  const buscarItensSelecionados = () => {
    if (!publicacao) {
      return [];
    }

    return publicacao.itens
      .map((item) => {
        const quantidadeDoada = Number(quantidadesDoacao[item.id] || 0);

        return {
          id: item.id,
          nome: item.nome,
          quantidadePedido: item.quantidade,
          quantidadeDoada: quantidadeDoada,
        };
      })
      .filter((item) => item.quantidadeDoada > 0);
  };

  const enviarMensagem = () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado como usuário para enviar uma doação.");
      navigate("/");
      return;
    }

    if (!publicacao) {
      alert("Publicação não encontrada.");
      navigate("/usuario-home");
      return;
    }

    const itensSelecionados = buscarItensSelecionados();

    if (itensSelecionados.length === 0) {
      alert("Informe pelo menos um item que você pode doar.");
      return;
    }

    if (dataEntrega.trim() === "" || horarioEntrega.trim() === "") {
      alert("Informe a data e o horário de entrega da doação.");
      return;
    }

    if (dataEntrega < dataMinima || dataEntrega > dataMaxima) {
      alert(
        "A data de entrega precisa estar dentro do prazo de até 3 dias úteis.",
      );
      return;
    }

    if (horarioEntrega < "07:00" || horarioEntrega > "20:00") {
      alert("O horário de entrega precisa estar entre 07:00 e 20:00.");
      return;
    }

    const doacoesSalvas =
      JSON.parse(localStorage.getItem("doacoesRecebidas")) || [];

    const novaDoacao = {
      id: Date.now(),
      publicacaoId: publicacao.id,

      nomeDoador: usuarioLogado.nome,
      contato: usuarioLogado.email,
      imagemDoador: usuarioLogado.imagem || "",

      itensDoacao: itensSelecionados,

      dataEntrega: dataEntrega,
      horarioEntrega: horarioEntrega,
      observacoes: observacoes.trim(),

      mensagem: observacoes.trim(),

      itemDoado: itensSelecionados
        .map((item) => `${item.quantidadeDoada} de ${item.nome}`)
        .join(", "),

      quantidadeDoada: itensSelecionados
        .map((item) => `${item.nome}: ${item.quantidadeDoada}`)
        .join(" | "),

      status: "Pendente",
      dataEnvio: new Date().toLocaleString("pt-BR"),
    };

    const listaAtualizada = [...doacoesSalvas, novaDoacao];

    localStorage.setItem("doacoesRecebidas", JSON.stringify(listaAtualizada));

    alert("Mensagem de doação enviada com sucesso!");

    navigate("/usuario-home");
  };

  if (!publicacao) {
    return (
      <div className="donation-page">
        <div className="donation-card">
          <h1>Publicação não encontrada</h1>

          <button type="button" onClick={() => navigate("/usuario-home")}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-page">
      <nav className="ong-navbar">
        <a href="#topo" className="ong-logo">
          <img src={logoImg} alt="Logo +COM" />
        </a>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/usuario-home")}>
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

      <main className="donation-main">
        <section className="donation-card">
          <h1>Enviar doação</h1>

          <p>
            Você está enviando uma mensagem para:
            <strong> {publicacao.ong.nome}</strong>
          </p>

          <div className="donation-needed-list">
            <h2>Necessidades da ONG</h2>

            {publicacao.itens.map((item) => (
              <div className="donation-item-selector" key={item.id}>
                <div>
                  <strong>{item.nome}</strong>
                  <p>Quantidade pedida: {item.quantidade}</p>
                </div>

                <label>
                  O quanto disso você pode doar?
                  <input
                    type="number"
                    min="0"
                    value={quantidadesDoacao[item.id] || 0}
                    onChange={(evento) =>
                      alterarQuantidade(item.id, evento.target.value)
                    }
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="ong-delivery-info">
            <h2>Informações para entrega</h2>

            <p>
              <strong>Dias de funcionamento:</strong>{" "}
              {publicacao.ong.diasFuncionamento || "Não informado"}
            </p>

            <p>
              <strong>Horário de funcionamento:</strong>{" "}
              {publicacao.ong.horarioFuncionamento || "Não informado"}
            </p>

            <p>
              <strong>Endereço:</strong>{" "}
              {publicacao.ong.endereco || "Não informado"}
            </p>
          </div>

          <div className="donation-form">
            <p className="donation-warning">
              Envie sua doação em até 3 dias úteis depois de enviar essa
              mensagem.
            </p>

            <div className="donation-input-group">
              <label>Data da entrega</label>
              <input
                type="date"
                min={dataMinima}
                max={dataMaxima}
                value={dataEntrega}
                onChange={(evento) => setDataEntrega(evento.target.value)}
              />
            </div>

            <div className="donation-input-group">
              <label>Horário da entrega</label>
              <input
                type="time"
                min="07:00"
                max="20:00"
                value={horarioEntrega}
                onChange={(evento) => setHorarioEntrega(evento.target.value)}
              />
            </div>

            <div className="donation-input-group">
              <label>Observações ou mensagem para a ONG</label>
              <textarea
                placeholder="Ex: Posso entregar na portaria ou combinar com algum responsável."
                value={observacoes}
                onChange={(evento) => setObservacoes(evento.target.value)}
              ></textarea>
            </div>

            <div className="donation-buttons">
              <button type="button" onClick={enviarMensagem}>
                Enviar mensagem
              </button>

              <button type="button" onClick={() => navigate("/usuario-home")}>
                Cancelar
              </button>
            </div>
          </div>
        </section>
      </main>

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

export default DonationMessage;
