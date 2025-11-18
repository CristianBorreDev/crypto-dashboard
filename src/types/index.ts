export interface CardCryptoProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export interface ChartPriceProps {
  data: { time: string; price: number }[];
  color: string;
}

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export interface FavoritesPanelProps {
  favorites: any[];
  onRemoveFavorite: (id: string) => void;
}

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}