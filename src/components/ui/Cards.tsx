import React from "react";
import { Heart, HeartCrack } from "lucide-react";
import type { CardCryptoProps } from "../../types";

const Cards: React.FC<CardCryptoProps & { onClick?: () => void }> = ({
  id,
  name,
  symbol,
  image,
  current_price,
  price_change_percentage_24h,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const changeColor =
    price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div
      className="bg-gray-800 rounded-2xl shadow-md p-3 flex flex-col items-start justify-between transition-transform duration-300 cursor-pointer
                 sm:p-4 sm:hover:scale-105"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <img src={image} alt={name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm sm:text-base">{name}</span>
          <span className="text-gray-300 text-xs sm:text-sm">{symbol.toUpperCase()}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-white font-bold text-sm sm:text-base">
          ${current_price.toLocaleString()}
        </span>
        <span className={`font-semibold text-xs sm:text-sm ${changeColor}`}>
          {price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>

      <button
        className="mt-2"
        onClick={(e) => {
          e.stopPropagation(); // evitar que seleccione la moneda
          onToggleFavorite(id);
        }}
      >
        {isFavorite ? (
          <HeartCrack className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Heart className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
};

export default Cards;
