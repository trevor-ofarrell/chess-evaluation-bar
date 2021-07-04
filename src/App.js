import "./index.css";
import EvalBar from "./lib/components/EvalBar";

function App() {
  return (
    <div style={{height: "100vh"}}>
      <EvalBar
        depth={30}
        fen="6k1/1p2p1b1/6pp/4p3/1P1n4/2QP1P2/q4KPP/8 w - - 5 31"
      />
    </div>
  );
}

export default App;
