import "./styles.css";

// React
import { useState, useEffect } from "react";

import { SplashScreen } from "./components/SplashScreen";
import { PantallaPrincipal } from "./components/PantallaPrincipal";
import { SettingsScreen } from "./components/SettingsScreen";

export default function App() {
  // estados
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("game-settings");
    return saved
      ? JSON.parse(saved)
      : {
          maxDigitos: 3,
          minDigitos: 3,
          restasLlevando: true,
        };
  });

  useEffect(() => {
    localStorage.setItem("game-settings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const screenJSX =
    currentScreen === "splash" ? (
      <SplashScreen
        msTimeout={6000}
        onTimeout={() => setCurrentScreen("main")}
      />
    ) : currentScreen === "main" ? (
      <PantallaPrincipal
        onSettings={() => setCurrentScreen("settings")}
        maxDigitos={settings.maxDigitos}
        minDigitos={settings.minDigitos}
        restasLlevando={settings.restasLlevando}
      />
    ) : (
      <SettingsScreen
        onBack={() => setCurrentScreen("main")}
        maxDigitos={settings.maxDigitos}
        onChangeMaxDigitos={(val) => handleChange("maxDigitos", Number(val))}
        minDigitos={settings.minDigitos}
        onChangeMinDigitos={(val) => handleChange("minDigitos", Number(val))}
        restasLlevando={settings.restasLlevando}
        onChangeRestasLlevando={(val) => handleChange("restasLlevando", val)}
      />
    );

  return <>{screenJSX}</>;
}
