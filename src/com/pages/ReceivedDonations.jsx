import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ReceivedDonations() {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    const buscar = async () => {
      const id = localStorage.getItem("ongId");

      const resposta = await fetch(
        `http://localhost:3001/contribuicoes/ong/${id}`,
      );

      const dados = await resposta.json();

      setDoacoes(dados);
    };

    buscar();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Doações recebidas</h1>

      {doacoes.length === 0 ? (
        <p>Nenhuma contribuição ainda</p>
      ) : (
        doacoes.map((doacao) => (
          <div key={doacao._id}>
            <h2>{doacao.nomeDoador}</h2>

            <p>
              Email:
              {doacao.emailDoador}
            </p>

            <p>
              Mensagem:
              {doacao.mensagem}
            </p>

            <img src={doacao.comprovanteArquivo} width="300" />

            <hr />
          </div>
        ))
      )}

      <Link to="/ong-home">Voltar</Link>
    </div>
  );
}

export default ReceivedDonations;
