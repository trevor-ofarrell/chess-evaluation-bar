import "./index.css";
import EvalBar from "./lib/components/EvalBar";

function App() {
  return (
    <div style={{height: "100vh"}}>
      <EvalBar depth={25} fen="2r1rk2/pppnnNpp/5q2/4p3/4P1Q1/1BP4P/PP4P1/R1B1K3 w - - 1 23" />
    </div>
  );
}

export default App;
