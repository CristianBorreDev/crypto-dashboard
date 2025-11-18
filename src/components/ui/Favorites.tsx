import React from "react";
import Cards from "./Cards";
import type { FavoritesPanelProps } from "../../types";
import { useCryptoStore } from "../../store/cryptoStore";

const Favorites: React.FC<FavoritesPanelProps> = ({ favorites, onRemoveFavorite }) => {
  const setSelectedCoin = useCryptoStore((state) => state.setSelectedCoin);

  if (favorites.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-4">
      <h2 className="text-white font-bold mb-2 text-lg">Favoritos</h2>

      {/* Mobile: scroll horizontal; Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-7 md:gap-4 md:overflow-y-auto md:max-h-40 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
        {favorites.map((coin) => (
          <Cards
            key={coin.id}
            {...coin}
            isFavorite={true}
            onToggleFavorite={() => onRemoveFavorite(coin.id)}
            onClick={() => setSelectedCoin(coin)}
            className="min-w-[100px] flex-shrink-0" // evita que se achique demasiado en mobile
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
