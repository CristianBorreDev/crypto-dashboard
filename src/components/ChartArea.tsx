import React from "react";
import { useCryptoStore } from "../store/cryptoStore";
import Charts from "./ui/Charts";
import Favorites from "./ui/Favorites";

const ChartArea: React.FC = () => {
  const favorites = useCryptoStore((state) => state.favorites);
  const selectedCoin = useCryptoStore((state) => state.selectedCoin);
  const historicalData = useCryptoStore((state) => state.historicalData);

  if (!selectedCoin) {
    return (
      <div className="text-gray-300 p-4">
        Selecciona una criptomoneda para ver la gráfica
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-1 p-4 md:p-6 gap-4 overflow-y-auto">
      {/* Favoritos arriba */}
      {favorites.length > 0 && (
        <Favorites
          favorites={favorites}
          onRemoveFavorite={(id: string) => useCryptoStore.getState().removeFavorite(id)}
        />
      )}

      <h2 className="text-xl md:text-2xl font-bold my-2 md:my-4 text-white">
        {selectedCoin.name} - Precio histórico
      </h2>

      {historicalData.length > 0 ? (
        <Charts data={historicalData} color="#10b981" />
      ) : (
        <div className="text-gray-300">Cargando datos...</div>
      )}
    </div>
  );
};

export default ChartArea;
