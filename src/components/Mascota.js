import { useEffect } from "react";

import { useRive, useViewModelInstanceNumber } from "@rive-app/react-webgl2";

import RiveMascota from "../../assets/Mascota.riv";

export function Mascota(props) {
  const { rive, RiveComponent } = useRive({
    src: RiveMascota,
    stateMachines: "State Machine 1",
    autoplay: true,
    autoBind: true,
  });
  const vmInstance = rive?.viewModelInstance;

  const { value: expression, setValue: setExpression } =
    useViewModelInstanceNumber("numberExpression", vmInstance);

  useEffect(() => {
    if (rive && props.expression !== undefined) {
      setExpression(props.expression);
    }
  }, [rive, props.expression, setExpression]);

  return (
    <div id="companion">
      <RiveComponent />
    </div>
  );
}
