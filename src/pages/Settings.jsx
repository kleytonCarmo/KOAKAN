import ConnectWhoop from "../components/ConnectWhoop.jsx";

export default function Settings({ connected, demo, onReload }) {
  return (
    <div className="fade-in">
      <ConnectWhoop connected={connected} demo={demo} onReload={onReload} />
    </div>
  );
}
