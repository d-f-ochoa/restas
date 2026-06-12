// React
import { useEffect } from "react";

export function SplashScreen(props) {
  //Propiedades
  // msTimeout: ms hasta llamar a la función onTimeout
  // onTimeout: oyente de eventos al que hay que llamar transcurridos los milisegundos en msTimeout
  useEffect(() => {
    setTimeout(() => {
      props.onTimeout();
    }, props.msTimeout);
  }, [props.msTimeout, props.onTimeout]);

  return (
    <div id="splash" className="screen">
      <img src="splash.svg" alt="Splash" />
    </div>
  );
}
