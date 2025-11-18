import { Container, Content, Row } from "./styles";
import Button from "./components/Button";
import Input from "./components/Input";
import { useState } from "react";

const botoes = [
  ["ON", "OFF", "C", "CE"],
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

const App = () => {
  const [currentNumber, setCurrentNumber] = useState("0");
  const [power, setPower] = useState(true);
  const [foiIgual, setFoiIgual] = useState(false);

  const handleClick = (label) => {
    if (!power && label !== "ON") return;

    const ehNumero = /^[0-9]$/.test(label);

    // Número após "=" reseta
    if (ehNumero) {
      setCurrentNumber((prev) => {
        if (
          prev === "0" ||
          prev === "Erro" ||
          prev === "NaN" ||
          prev === "Infinity" ||
          prev === "" ||
          foiIgual
        ) {
          setFoiIgual(false);
          return label;
        }
        return prev + label;
      });
      return;
    }

    // Número negativo no início
    if (label === "-" && (currentNumber === "0" || currentNumber === "")) {
      setCurrentNumber("-");
      setFoiIgual(false);
      return;
    }

    // Prevenção de múltiplos pontos no mesmo número
    if (label === ".") {
      const ultimoTrecho = currentNumber.split(/[\+\-\×\÷]/).pop();
      if (ultimoTrecho.includes(".")) return;

      setCurrentNumber(currentNumber + ".");
      setFoiIgual(false);
      return;
    }

    // Impede operações quando display está inválido
    const estadoInvalido = [
      "Erro",
      "Infinity",
      "-Infinity",
      "NaN",
      "",
    ].includes(currentNumber);

    if (estadoInvalido) {
      if (["+", "-", "×", "÷", "="].includes(label)) return;
    }

    const ehOperador = ["+", "-", "×", "÷"].includes(label);

    if (ehOperador) {
      const ultimo = currentNumber.slice(-1);

      // Operador após "=" — continua conta
      if (foiIgual) {
        setFoiIgual(false);
        setCurrentNumber((prev) => prev + label);
        return;
      }

      // Substitui operador repetido
      if (["+", "-", "×", "÷"].includes(ultimo)) {
        setCurrentNumber(currentNumber.slice(0, -1) + label);
        return;
      }

      setCurrentNumber(currentNumber + label);
      return;
    }

    // Ações especiais
    switch (label) {
      case "CE":
        setCurrentNumber("0");
        setFoiIgual(false);
        break;

      case "C":
        if (
          currentNumber === "Erro" ||
          currentNumber === "NaN" ||
          currentNumber === "Infinity" ||
          currentNumber === "-Infinity" ||
          currentNumber === ""
        ) {
          setCurrentNumber("0");
          setFoiIgual(false);
    break;
  }

  // Caso normal → apaga um caractere
  setCurrentNumber((prev) => {
    const novo = prev.slice(0, -1);
    return novo === "" ? "0" : novo;
  });

  setFoiIgual(false);
        break;

      case "=":
        calcular();
        setFoiIgual(true);
        break;

      case "ON":
        setPower(true);
        setCurrentNumber("0");
        setFoiIgual(false);
        break;

      case "OFF":
        setPower(false);
        setCurrentNumber("");
        setFoiIgual(false);
        break;

      default:
        // Operador após "=" continua conta
        if (foiIgual) setFoiIgual(false);

        setCurrentNumber((prev) => {
          if (
            prev === "Erro" ||
            prev === "NaN" ||
            prev === "Infinity" ||
            prev === ""
          ) {
            return "0";
          }
          return prev + label;
        });
        break;
    }
  };

  const calcular = () => {
    try {
      const expressao = currentNumber
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      const resultado = eval(expressao);

      if (isNaN(resultado) || resultado === Infinity) {
        setCurrentNumber("Erro");
      } else {
        setCurrentNumber(String(resultado));
      }
    } catch {
      setCurrentNumber("Erro");
    }
  };

  return (
    <Container>
      <Content>
        <Input value={currentNumber} />

        {botoes.map((linha, i) => (
          <Row key={i}>
            {linha.map((label) => (
              <Button
                key={label}
                label={label}
                onClick={() => handleClick(label)}
              />
            ))}
          </Row>
        ))}
      </Content>
    </Container>
  );
};

export default App;
