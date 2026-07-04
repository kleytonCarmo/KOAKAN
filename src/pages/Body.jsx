import { useEffect, useState } from "react";
import BodyMetrics from "../components/BodyMetrics.jsx";
import { getStorage, setStorage, KEYS } from "../lib/storage.js";

export default function Body({ weekly }) {
  const [checkpoints, setCheckpoints] = useState(() => getStorage(KEYS.checkpoints, []));

  useEffect(() => {
    setStorage(KEYS.checkpoints, checkpoints);
  }, [checkpoints]);

  return (
    <div className="fade-in">
      <BodyMetrics
        checkpoints={checkpoints}
        setCheckpoints={setCheckpoints}
        weekly={weekly}
      />
    </div>
  );
}
