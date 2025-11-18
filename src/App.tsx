import { useEffect } from "react";
import Alert from "./components/ui/Alert";
import { useCryptoStore } from "./store/cryptoStore";
import Sidebar from "./components/layout/Sidebar";
import ChartArea from "./components/ChartArea";

function App() {
  const { fetchCryptos } = useCryptoStore();

  useEffect(() => {
    fetchCryptos();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-4 text-white">
      {/* Contenedor principal: mobile-first flex-col */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <Sidebar />
        </div>

        {/* Área de gráficos */}
        <div className="flex-1">
          {/* FilterBar */}
          <Alert />

          {/* ChartArea */}
          <ChartArea />
        </div>
      </div>
    </div>
  );
}

export default App;
