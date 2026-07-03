import { useEffect, useState } from "react";
import BodyMetrics from "../components/BodyMetrics.jsx";
import { getStorage, setStorage, KEYS } from "../lib/storage.js";

const DEFAULT = [{ date: "Semana 1", bodyFat: 15, waist: 81, leanMass: 58 }];

export default function Body() {
  const [checkpoints, setCheckpoints] = useState(() => getStorage(KEYS.checkpoints, DEFAULT));

  useEffect(() => {
    setStorage(KEYS.checkpoints, checkpoints);
  }, [checkpoints]);

  return (
    <div className="fade-in">
      <BodyMetrics checkpoints={checkpoints} setCheckpoints={setCheckpoints} />
    </div>
  );
}
