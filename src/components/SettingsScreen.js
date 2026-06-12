import { ArrowLeft } from "lucide-react";

import { Toggle, Select, Form, Card } from "react-daisyui";

export function SettingsScreen(props) {
  // 1. Inicializamos el estado intentando leer de localStorage

  // 2. Cada vez que 'settings' cambie, lo guardamos automáticamente

  // Funciones para actualizar solo una parte del objeto

  return (
    <div id="settings" className="screen">
      <button
        id="btn-back"
        className="btn-circular"
        aria-label="Retroceder"
        onClick={props.onBack}
      >
        <ArrowLeft size={60} color="gray" />
      </button>
      <div
        id="opciones"
        data-theme="cupcake"
        className="min-h-screen flex items-center justify-center bg-base-200 p-4"
      >
        <Card className="w-full max-w-md bg-base-100 shadow-xl border-4 border-primary">
          <Card.Body>
            <Card.Title className="text-2xl font-bold text-primary mb-4">
              Configuración
            </Card.Title>

            {/* --- SWITCH (Toggle) --- */}
            <Form.Label title="Restas llevando" className="cursor-pointer">
              <Toggle
                color="primary"
                checked={props.restasLlevando}
                onChange={(e) => props.onChangeRestasLlevando(e.target.checked)}
              />
            </Form.Label>

            <div className="divider"></div>

            {/* --- DESPLEGABLE (Select) --- */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">
                  Número mínimo de cifras de las operaciones
                </span>
              </label>
              <Select
                value={props.minDigitos}
                //onChange={(e) => handleChange("minimo", e.target.value)}
                onChange={(e) => props.onChangeMinDigitos(e.target.value)}
              >
                <Select.Option value={2}> 2</Select.Option>
                <Select.Option value={3}> 3</Select.Option>
                <Select.Option value={4}> 4</Select.Option>
              </Select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">
                  Número máximo de cifras de las operaciones
                </span>
              </label>
              <Select
                value={props.maxDigitos}
                //onChange={(e) => handleChange("máximo", e.target.value)}
                onChange={(e) => props.onChangeMaxDigitos(e.target.value)}
              >
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
              </Select>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
