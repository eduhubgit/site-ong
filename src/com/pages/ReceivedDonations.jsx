import { Link } from "react-router-dom";

function ReceivedDonations() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Doações recebidas</h1>

      <p>
        Aqui futuramente aparecerão as doações recebidas pela ONG.
      </p>

      <Link to="/home">Voltar para Home</Link>
    </div>
  );
}

export default ReceivedDonations;