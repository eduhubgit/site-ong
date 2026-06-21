import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../styles/registerONG.css";
import loginImage from "../assets/login-image.png";
import fundoImage from "../../assets/fundo.png";

function RegisterONG() {
  const navigate = useNavigate();
  const imagemInputRef = useRef(null);

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [ong, setOng] = useState({
  nome: "",
  cnpj: "",
  email: "",
  cidade: "",
  endereco: "",
  nichoPrincipal: "",
  chavePix: "",
  diasFuncionamento: "",
  horarioFuncionamento: "",
  senha: "",
  imagem: "",
  sobre: "",
  tipo: "ong",
  });

  const mudarCampo = (evento) => {
    const { name, value } = evento.target;

    setOng({
      ...ong,
      [name]: value,
    });
  };

  const mudarCNPJ = (evento) => {
    const apenasNumeros = evento.target.value.replace(/\D/g, "").slice(0, 14);

    setOng({
      ...ong,
      cnpj: apenasNumeros,
    });
  };

  const carregarImagem = (evento) => {
    const arquivo = evento.target.files[0];

    if (!arquivo) {
      return;
    }

    if (arquivo.size > 1000000) {
      alert("A imagem é muito grande. Escolha uma imagem menor que 1MB.");
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      setOng({
        ...ong,
        imagem: leitor.result,
      });
    };

    leitor.readAsDataURL(arquivo);
  };

  const removerImagem = () => {
    setOng({
      ...ong,
      imagem: "",
    });

    if (imagemInputRef.current) {
      imagemInputRef.current.value = "";
    }
  };

  //cadastrar ONG
  
  const cadastrarONG = async (evento) => {
    evento.preventDefault();

    if (ong.cnpj.length !== 14) {
      alert("O CNPJ precisa ter exatamente 14 números.");
      return;
    }

    const novaONG = {
      nome: ong.nome.trim(),
      cnpj: ong.cnpj.trim(),
      email: ong.email.trim().toLowerCase(),

      cidade: ong.cidade.trim(),
      endereco: ong.endereco.trim(),
      nichoPrincipal: ong.nichoPrincipal.trim(),
      chavePix: ong.chavePix.trim(),
      diasFuncionamento: ong.diasFuncionamento.trim(),
      horarioFuncionamento: ong.horarioFuncionamento.trim(),

      localizacao: ong.cidade.trim(),
      nicho: ong.nichoPrincipal.trim(),

      senha: ong.senha,
      imagem: ong.imagem,
      sobre: ong.sobre.trim(),
      tipo: "ong"
    };

    try {

    await fetch("http://localhost:3001/ongs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novaONG)

    });

    alert("ONG cadastrada com sucesso");
    navigate("/ong-home");

  } catch (erro) {
    console.log(erro);
    alert("Erro ao cadastrar ONG");
  }
    
  };





  return (
    <div className="register-page">
      <img src={fundoImage} alt="Fundo" className="bg-full-image" />

      <div className="register-container">
        <div className="register-top">
          <label>Entrar como</label>

          <select
            onChange={(evento) =>
              evento.target.value === "usuario" && navigate("/register-user")
            }
          >
            <option value="ong">ONG</option>
            <option value="usuario">Usuário</option>
          </select>
        </div>

        <div className="register-content">
          <form className="register-left" onSubmit={cadastrarONG}>
            <h1>Cadastrar ONG</h1>

            <div className="row-inputs">
              <div className="input-group-register">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={ong.nome}
                  onChange={mudarCampo}
                  required
                />
              </div>

              <div className="input-group-register">
                <label>CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  value={ong.cnpj}
                  onChange={mudarCNPJ}
                  maxLength="14"
                  placeholder="Somente números"
                  required
                />
              </div>
            </div>

            <div className="input-group-register">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={ong.email}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="row-inputs">
              <div className="input-group-register">
                <label>Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={ong.cidade}
                  onChange={mudarCampo}
                  required
                />
              </div>

              <div className="input-group-register">
                <label>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={ong.endereco}
                  onChange={mudarCampo}
                  required
                />
              </div>
            </div>

            <div className="input-group-register">
              <label>Nicho principal</label>
              <input
                type="text"
                name="nichoPrincipal"
                value={ong.nichoPrincipal}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Chave Pix</label>
              <input
                type="text"
                name="chavePix"
                value={ong.chavePix}
                onChange={mudarCampo}
                placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                required
              />
            </div>

            <div className="row-inputs">
              <div className="input-group-register">
                <label>Dias de funcionamento</label>
                <input
                  type="text"
                  name="diasFuncionamento"
                  value={ong.diasFuncionamento}
                  onChange={mudarCampo}
                  placeholder="Ex: Segunda a sexta"
                  required
                />
              </div>

              <div className="input-group-register">
                <label>Horário de funcionamento</label>
                <input
                  type="text"
                  name="horarioFuncionamento"
                  value={ong.horarioFuncionamento}
                  onChange={mudarCampo}
                  placeholder="Ex: 08:00 às 17:00"
                  required
                />
              </div>
            </div>

            <div className="input-group-register">
              <label>Senha</label>

              <div className="password-input-area">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  value={ong.senha}
                  onChange={mudarCampo}
                  required
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="input-group-register">
              <label>Imagem da ONG</label>
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                ref={imagemInputRef}
                className="file-input"
              />
            </div>

            {ong.imagem && (
              <div className="register-image-area">
                <img
                  className="register-image-preview"
                  src={ong.imagem}
                  alt="Prévia da ONG"
                />

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={removerImagem}
                >
                  Remover imagem
                </button>
              </div>
            )}

            <div className="input-group-register">
              <label>Sobre a ONG</label>
              <textarea
                name="sobre"
                value={ong.sobre}
                onChange={mudarCampo}
                placeholder="Escreva um pequeno texto sobre a ONG..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-criar-ong">
              Criar ONG
            </button>

            <p className="login-link">
              Já tem uma conta? <Link to="/">Entrar</Link>
            </p>
          </form>

          <div className="register-right">
            <img src={loginImage} alt="Ilustração de cadastro" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterONG;