// React
import { useState, useEffect } from "react";
import { useRive, useViewModelInstanceNumber } from "@rive-app/react-webgl2";
import { ControladorCifra } from "./ControladorCifra";
import RiveCasa from "../../assets/casaresta.riv";

// Constantes de ayuda para evitar "magic strings" y simplificar lógicas
const ARRAY_FILAS = ["M", "S"];
const POS_ORDER = ["M", "C", "D", "U"];
const POS_REVERSE = ["U", "D", "C", "M"]; // Orden de resolución (derecha a izquierda)

function numberFromCodes(arrayCodes) {
  const stringNumerico = arrayCodes.join("");
  return stringNumerico ? parseInt(stringNumerico, 10) : -1;
}

function decomposeNumber(nValue) {
  const str = String(nValue || "").padStart(4, " ");
  return { M: str[0], C: str[1], D: str[2], U: str[3] };
}

function convertPosToIndex(nDigits, strPos) {
  // Ej: Si U (index 0) => nDigits - 1. Si D (index 1) => nDigits - 2.
  return nDigits - 1 - POS_REVERSE.indexOf(strPos);
}

// Función para generar la estructura de las 8 cifras limpias
function generateBlankDigits() {
  const init = {};
  ARRAY_FILAS.forEach((f) => {
    POS_ORDER.forEach((p) => {
      init[`${f}${p}`] = {
        stringCifra: "",
        booleanActivo: false,
        booleanMas1: false,
        booleanUnoIzqda: false,
      };
    });
  });
  return init;
}

export function CasaResta(props) {
  const [activoHasta, setActivoHasta] = useState("U");
  const [maxCifras, setMaxCifras] = useState(4);
  const [cifras, setCifras] = useState(generateBlankDigits());
  const [codesSol, setCodesSol] = useState(["", "", "", ""]);

  const { rive, RiveComponent } = useRive({
    src: RiveCasa,
    stateMachines: "State Machine 1",
    autoplay: true,
    autoBind: true,
  });

  const vmInstance = rive?.viewModelInstance;
  const { value: numberCifras, setValue: setNumberCifras } =
    useViewModelInstanceNumber("numberCifras", vmInstance);

  // 1. Inicialización de valores al recibir props
  useEffect(() => {
    const arrayM = decomposeNumber(props.minuendo);
    const arrayS = decomposeNumber(props.sustraendo);
    const nCifras = props.minuendo.toString().length;

    setCifras((prev) => {
      const newState = { ...prev };
      ARRAY_FILAS.forEach((fila) => {
        POS_ORDER.forEach((pos) => {
          const valorCrudo = fila === "M" ? arrayM[pos] : arrayS[pos];
          newState[`${fila}${pos}`] = {
            stringCifra: valorCrudo !== " " ? valorCrudo.toString() : "",
            booleanActivo: pos === "U", // Solo las unidades activas al inicio
            booleanMas1: false,
            booleanUnoIzqda: false,
          };
        });
      });
      return newState;
    });

    setActivoHasta("U");
    setNumberCifras(nCifras);
    setCodesSol(new Array(nCifras).fill(""));
  }, [rive, props.minuendo, props.sustraendo]);

  // 2. Lógica de activación de columnas
  useEffect(() => {
    const targetIdx = POS_REVERSE.indexOf(activoHasta);

    setCifras((prev) => {
      const next = { ...prev };
      POS_REVERSE.forEach((pos, idx) => {
        // Activamos si está dentro del límite de la posición actual y respeta maxCifras
        if (idx <= targetIdx && maxCifras > Math.max(0, idx - 1)) {
          next[`M${pos}`] = { ...next[`M${pos}`], booleanActivo: true };
          next[`S${pos}`] = { ...next[`S${pos}`], booleanActivo: true };
        }
      });
      return next;
    });
  }, [activoHasta, maxCifras]);

  function handleChange(e, nIndex) {
    const strVal = e.target.value;
    if (!/^[0-9]?$/.test(strVal)) return;

    const arrayNewCodesSol = [...codesSol];
    arrayNewCodesSol[nIndex] = strVal;
    setCodesSol(arrayNewCodesSol);

    // Salto a la izquierda dinámico
    if (strVal && activoHasta !== "M") {
      const nextIdx = POS_REVERSE.indexOf(activoHasta) + 1;
      setActivoHasta(POS_REVERSE[nextIdx]);
    }

    props.onChangeResultado(numberFromCodes(arrayNewCodesSol));
  }

  function onClickCifra(strRow, strPos) {
    if (!cifras[`${strRow}${strPos}`].booleanActivo) return;

    const strClaveClicada = `${strRow}${strPos}`;

    if (strRow === "M") {
      const nCifraFinalS =
        Number(cifras[`S${strPos}`].stringCifra) +
        (cifras[`S${strPos}`].booleanMas1 ? 1 : 0);

      if (Number(cifras[strClaveClicada].stringCifra) < nCifraFinalS) {
        setCifras((prev) => ({
          ...prev,
          [strClaveClicada]: {
            ...prev[strClaveClicada],
            booleanUnoIzqda: true,
          },
        }));
      }
    } else if (strRow === "S" && strPos !== "U") {
      // Obtenemos la posición anterior usando un mapa sencillo
      const posPrevia = { D: "U", C: "D", M: "C" }[strPos];

      if (cifras[`M${posPrevia}`].booleanUnoIzqda) {
        setCifras((prev) => ({
          ...prev,
          [strClaveClicada]: { ...prev[strClaveClicada], booleanMas1: true },
        }));
      }
    }
  }

  return (
    <div id="casa-resta">
      <div id="problema">
        <RiveComponent />
        {vmInstance &&
          ARRAY_FILAS.map((f) =>
            POS_ORDER.map((p) => (
              <ControladorCifra
                key={`${f}${p}`}
                vm={vmInstance}
                fila={f}
                pos={p}
                datos={cifras[`${f}${p}`]}
                onClick={onClickCifra}
              />
            ))
          )}
      </div>
      <div id="respuesta">
        <div id="contenedor-inputs">
          {codesSol.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              className="input-digito"
              disabled={i < convertPosToIndex(codesSol.length, activoHasta)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
