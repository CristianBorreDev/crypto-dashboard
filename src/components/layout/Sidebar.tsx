import React, { useState } from "react";
import { useCryptoStore } from "../../store/cryptoStore";
import Cards from "../ui/Cards";
import type { Crypto } from "../../types";
import { Menu, X } from "lucide-react";

const Sidebar: React.FC = () => {
  const cryptos = useCryptoStore((state) => state.cryptos);
  const favorites = useCryptoStore((state) => state.favorites);
  const setSelectedCoin = useCryptoStore((state) => state.setSelectedCoin);
  const addFavorite = useCryptoStore((state) => state.addFavorite);
  const removeFavorite = useCryptoStore((state) => state.removeFavorite);

  const [isOpen, setIsOpen] = useState(false); // para mobile
  const [search, setSearch] = useState(""); // buscador interno

  const handleToggleFavorite = (coin: Crypto) => {
    if (favorites.find((f) => f.id === coin.id)) {
      removeFavorite(coin.id);
    } else {
      addFavorite(coin);
    }
  };

  // Filtrar cryptos según búsqueda
  const filteredCryptos = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Botón de menú para mobile */}
      <div className="md:hidden flex justify-between items-center mb-4 p-2 bg-gray-800 rounded-xl">
        <h2 className="text-xl font-bold text-white">Grafico</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          bg-gray-800 p-4 overflow-y-auto
          fixed top-0 left-0 z-50 w-full md:w-64 transform
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 h-screen md:h-[90vh]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Título para desktop */}
        <h2 className="text-xl font-bold mb-4 text-white hidden md:block">
          Criptomonedas
        </h2>

        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold text-white">Criptomonedas</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl focus:outline-none"
          >
            <X />
          </button>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full p-2 rounded-xl text-white border border-[#10b981] focus:outline-none focus:ring-2 focus:ring-[#18976d]"
        />

        <div className="flex flex-col gap-4">
          {filteredCryptos.length > 0 ? (
            filteredCryptos.map((coin) => (
              <Cards
                key={coin.id}
                {...coin}
                isFavorite={!!favorites.find((f) => f.id === coin.id)}
                onToggleFavorite={() => handleToggleFavorite(coin)}
                onClick={() => {
                  setSelectedCoin(coin);
                  setIsOpen(false); // cierra sidebar en mobile al seleccionar
                }}
              />
            ))
          ) : (
            <div className="text-gray-300 text-sm">
              No se encontraron criptomonedas.
            </div>
          )}
        </div>
      </div>

      {/* Fondo oscuro cuando la sidebar está abierta en mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
