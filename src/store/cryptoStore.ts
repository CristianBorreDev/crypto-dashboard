// src/store/cryptoStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Crypto } from "../types";

interface CryptoState {
  cryptos: Crypto[];
  favorites: Crypto[];
  selectedCoin: Crypto | null;
  historicalData: { time: string; price: number }[];
  historicalCache: Record<string, { time: string; price: number }[]>;
  loading: boolean;
  error: string | null;
  cooldownUntil: number | null; // timestamp ms para cooldown
  secondsLeft: number; // segundos restantes del cooldown

  fetchCryptos: () => Promise<void>;
  fetchHistorical: (id: string, days?: number) => Promise<void>;
  addFavorite: (coin: Crypto) => void;
  removeFavorite: (id: string) => void;
  setSelectedCoin: (coin: Crypto) => void;
  clearError: () => void;
  setCooldown: (seconds: number) => void;
  tickCooldown: () => void;
}

// URL de tu backend proxy
const API = "http://localhost:5000/api/coingecko";

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      cryptos: [],
      favorites: [],
      selectedCoin: null,
      historicalData: [],
      historicalCache: {},
      loading: false,
      error: null,
      cooldownUntil: null,
      secondsLeft: 0,

      clearError: () => set({ error: null }),

      setCooldown: (seconds: number) => {
        const until = Date.now() + seconds * 1000;
        set({ cooldownUntil: until, secondsLeft: seconds });
        const interval = setInterval(() => {
          get().tickCooldown();
          if ((Date.now() - until) >= 0) clearInterval(interval);
        }, 1000);
      },

      tickCooldown: () => {
        const { cooldownUntil } = get();
        if (!cooldownUntil) return;
        const diff = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        set({ secondsLeft: diff });
        if (diff === 0) set({ cooldownUntil: null });
      },

      fetchCryptos: async () => {
        if (get().cooldownUntil) return; // no hacer fetch si hay cooldown
        set({ loading: true, error: null });

        try {
          const url = `${API}?path=coins/markets&vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
          const res = await fetch(url);

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            if (res.status === 429) {
              const retryAfter = 60; // segundos
              get().setCooldown(retryAfter);
              throw new Error(
                `Se alcanzó el límite de peticiones. Intenta de nuevo en ${retryAfter}s.`
              );
            }
            throw new Error(`API error ${res.status} - ${text}`);
          }

          const data = await res.json();
          if (!Array.isArray(data)) throw new Error("CoinGecko returned invalid market data");

          set({ cryptos: data, loading: false });
        } catch (err) {
          set({ error: String(err), loading: false });
        }
      },

      fetchHistorical: async (coinId: string, days = 30) => {
        if (get().cooldownUntil) return; // prevenir fetch durante cooldown
        const cached = get().historicalCache[coinId];
        if (cached) {
          set({ historicalData: cached });
          return;
        }

        set({ loading: true, error: null });

        try {
          const url = `${API}?path=coins/${encodeURIComponent(
            coinId
          )}/market_chart&vs_currency=usd&days=${days}&interval=daily`;

          const res = await fetch(url);

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            if (res.status === 429) {
              const retryAfter = 60;
              get().setCooldown(retryAfter);
              throw new Error(
                `Se alcanzó el límite de peticiones. Intenta de nuevo en ${retryAfter}s.`
              );
            }
            throw new Error(`API error ${res.status} - ${text}`);
          }

          const raw = await res.json();
          if (!raw || !Array.isArray(raw.prices)) {
            console.warn("Unexpected historical payload:", raw);
            set({ historicalData: [], loading: false });
            return;
          }

          const mapped = raw.prices.map(([ts, price]: [number, number]) => ({
            time: new Date(ts).toLocaleDateString(),
            price,
          }));

          set({ historicalData: mapped, loading: false });
          set((state) => ({
            historicalCache: { ...state.historicalCache, [coinId]: mapped },
          }));
        } catch (err) {
          set({ error: String(err), loading: false });
        }
      },

      addFavorite: (coin: Crypto) => {
        const favs = get().favorites;
        if (!favs.some((f) => f.id === coin.id)) {
          set({ favorites: [...favs, coin] });
        }
      },

      removeFavorite: (id: string) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      setSelectedCoin: (coin: Crypto) => {
        set({ selectedCoin: coin });
        get()
          .fetchHistorical(coin.id)
          .catch((err) => { set({ error: String(err), loading: false }); });
      },
    }),
    {
      name: "crypto-store",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
