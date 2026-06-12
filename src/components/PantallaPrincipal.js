// React
import { useEffect, useState } from "react";

import { CasaResta } from "./CasaResta";

import { Mascota } from "./Mascota";

import { Settings } from "lucide-react";

import sonidoCorrectoFile from "../sonido/correcto.mp3";
import sonidoErrorFile from "../sonido/error.mp3";

function randomNumbers(nMaxDigits, nMinDigits, boolRequiresBorrow) {
  // Las restas de 1 cifra no pueden tener llevada técnicamente
  if (nMaxDigits < 2 && boolRequiresBorrow)
    throw new Error("No hay llevada con 1 dígito");

  if (nMinDigits < 2) nMinDigits = 2;

  let boolValid = false;
  let nNum1, nNum2, nNumMax, nNumMin;
  let strNumMax, strNumMin;

  do {
    const minRange = Math.pow(10, nMaxDigits - 1);
    const maxRange = Math.pow(10, nMaxDigits);

    nNum1 = Math.floor(Math.random() * (maxRange - minRange)) + minRange;
    nNum2 = Math.floor(Math.random() * maxRange);

    nNumMax = Math.max(nNum1, nNum2);
    nNumMin = Math.min(nNum1, nNum2);

    console.log(nNumMax);
    console.log(nNumMin);

    strNumMax = nNumMax.toString();
    strNumMin = nNumMin.toString();

    for (nIdx = strNumMin.length; nIdx >= 0; nIdx--) {
      if (Number(strNumMax.charAt(nIdx)) < Number(strNumMin.charAt(nIdx))) {
        boolValid = true;
      }
    }
  } while (!boolValid);

  return { nMax: nNumMax, nMin: nNumMin };
}

export function PantallaPrincipal(props) {
  // const [digitosMax, setDigitosMax] = useState(2); //este es el numero de cifrras, en los ajustes deberian de ser desplegabkes
  // const [digitosMin, setDigitosMin] = useState(2); // desplegable tambien
  // const [soloRestasLlevando, setSoloRestasLlevando] = useState(true); // esto opcion , se llama switch
  const [numerosProblema, setNumerosProblema] = useState(() => {
    return randomNumbers(
      props.maxDigitos,
      props.minDigitos,
      props.restasLlevando
    );
  });
  const [respuesta, setRespuesta] = useState(null);
  const [mensaje, setMensaje] = useState("¡A restar!");

  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (mensaje !== "¡A restar!") {
      setRespuesta(null);
      const timer = setTimeout(() => {
        setMensaje("¡A restar!");
        setNumerosProblema(
          randomNumbers(
            props.maxDigitos,
            props.minDigitos,
            props.restasLlevando
          )
        );
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  useEffect(() => {
    console.log(props.maxDigitos);
    setRespuesta(null);
    setMensaje("¡A restar!");
    setNumerosProblema(
      randomNumbers(props.maxDigitos, props.minDigitos, props.restasLlevando)
    );
  }, [props.maxDigitos]);

  useEffect(() => {
    const sonidoCorrecto = new Audio(sonidoCorrectoFile);
    const sonidoError = new Audio(sonidoErrorFile);

    if (mensaje === "¡Acertaste!") {
      sonidoCorrecto.currentTime = 0;
      sonidoCorrecto.play();
    }

    if (mensaje === "Esta vez has fallado. ¡A por la siguiente!") {
      sonidoError.currentTime = 0;
      sonidoError.play();
    }
  }, [mensaje]);

  useEffect(() => {
    if (mensaje !== "¡A restar!") return;

    const interval = setInterval(() => {
      setIdle(true);

      setTimeout(() => {
        setIdle(false);
      }, 3000); // dura 3 segundos el estado 4
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, [mensaje]);

  function onChangeResult(numberRespuesta) {
    console.log(numberRespuesta);
    setRespuesta(numberRespuesta);
  }

  function checkAnswer() {
    if (respuesta === numerosProblema.nMax - numerosProblema.nMin) {
      setMensaje("¡Acertaste!");
    } else {
      setMensaje("Esta vez has fallado. ¡A por la siguiente!");
    }
  }

  return (
    <div id="main" className="screen">
      <button id="btn-settings" className="btn-circular" aria-label="Ajustes">
        <Settings size={60} color="gray" onClick={() => props.onSettings()} />
      </button>
      <div id="panel-izqdo">
        <CasaResta
          minuendo={numerosProblema.nMax}
          sustraendo={numerosProblema.nMin}
          onChangeResultado={onChangeResult}
        />
      </div>
      <div id="panel-dcho">
        <div id="mensaje">{mensaje}</div>
        <button
          className="btn-comprobar"
          disabled={mensaje !== "¡A restar!"}
          onClick={checkAnswer}
        >
          <span>¡COMPROBAR!</span>
        </button>
        <Mascota
          expression={
            mensaje === "¡Acertaste!"
              ? 2
              : mensaje === "Esta vez has fallado. ¡A por la siguiente!"
              ? 3
              : idle
              ? 4
              : 1
          }
        />
      </div>
    </div>
  );
}
