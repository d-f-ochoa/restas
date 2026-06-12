import { useEffect } from "react";

import {
  useViewModelInstanceBoolean,
  useViewModelInstanceString,
} from "@rive-app/react-webgl2";

export function ControladorCifra({ vm, fila, pos, datos, onClick }) {
  // Construimos el nombre de la instancia: "viewModelCifra" + "M" + "U" -> "viewModelCifraMU"
  const instanceName = `viewModelCifra${fila}${pos}`;

  const numberCifra = useViewModelInstanceString(
    `${instanceName}/stringCifra`,
    vm
  );
  const booleanActivo = useViewModelInstanceBoolean(
    `${instanceName}/booleanActivo`,
    vm
  );
  const booleanMas1 = useViewModelInstanceBoolean(
    `${instanceName}/booleanMas1`,
    vm
  );
  const booleanUnoIzqda = useViewModelInstanceBoolean(
    `${instanceName}/booleanUnoIzqda`,
    vm
  );
  const booleanClick = useViewModelInstanceBoolean(
    `${instanceName}/booleanClick`,
    vm
  );

  useEffect(() => {
    if (booleanActivo.value && booleanClick.value === true) {
      // Avisamos a la app de React qué cifra se pulsó
      onClick(fila, pos);
      booleanClick.setValue(false);
    }
  }, [booleanClick.value, fila, pos, onClick]);

  useEffect(() => {
    if (numberCifra.setValue) numberCifra.setValue(datos.stringCifra || "");
    if (booleanActivo.setValue) booleanActivo.setValue(!!datos.booleanActivo);
    if (booleanMas1.setValue) booleanMas1.setValue(!!datos.booleanMas1);
    if (booleanUnoIzqda.setValue)
      booleanUnoIzqda.setValue(!!datos.booleanUnoIzqda);
  }, [datos, numberCifra, booleanActivo, booleanMas1, booleanUnoIzqda]);

  return null;
}
