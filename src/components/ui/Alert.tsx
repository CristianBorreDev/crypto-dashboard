import { useEffect, useState } from "react";
import { useCryptoStore } from "../../store/cryptoStore";

const Alert = () => {
  const cooldown = useCryptoStore((state) => state.secondsLeft);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(cooldown);
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {secondsLeft > 0 && (
        <div className="text-yellow-300 text-sm bg-yellow-900 bg-opacity-20 p-2 rounded-lg">
          ⚠️ Has alcanzado el límite de peticiones. Puedes intentar de nuevo en{" "}
          <strong>{secondsLeft}s</strong>.
        </div>
      )}
    </div>
  );
};

export default Alert;
