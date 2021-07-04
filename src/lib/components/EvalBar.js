import React, { useState, useEffect } from "react";
import Chess from "chess.js";

let stockfish = new Worker("/stockfish.js");

const EvalBar = ({fen, depth}) => {
  const [sfEval, setSfEval] = useState("");
  const [wHeight, setWHeight] = useState(50);
  const [FEN, setFEN] = useState(fen);

  const onStockfishMsg = (event, fen) => {
    if (event.data.startsWith("info depth")) {
      let adv, messageEvalType;
      let message = event.data.split(" ");
      const chess = new Chess();
      chess.load(fen);
      const turn = chess.turn();

      if (message.includes("mate")) {
        messageEvalType = `M${message[message.indexOf("mate") + 1]}`
      } else {
        messageEvalType = message[message.indexOf("cp") + 1]
      }

      let evaluation = convertEvaluation(
        messageEvalType,
        turn
      );

      if (evaluation.startsWith('M')) {
        if (evaluation === "M0") {
          if (turn === 'b') {
            setWHeight(100);
          } else {
            setWHeight(0);
          }
          setSfEval(evaluation.replace('-', '').replace('M', '#'));
        } else {
          console.log('mate', evaluation)
          if (
            (turn === 'w' && evaluation[1] != '-') ||
            (turn === 'b' && evaluation[1] === '-')
          ) {
            setWHeight(100);
          } else {
            setWHeight(0);
          }
          setSfEval(evaluation.replace('-', '').replace('M', '#'));
        }
      } else {
        if (evaluation.startsWith('-')) adv = 'b';
        else adv = 'w';
  
        if ((parseFloat(evaluation) / 100).toFixed(1) === 0.0) {
          evaluation = Math.abs(evaluation);
        }
        setSfEval((parseFloat(evaluation) / 100).toFixed(1));
  
        evaluation = Math.abs(parseFloat(evaluation) / 100);
        const evaluated = evaluateFunc(evaluation);
  
        if (adv === 'w') setWHeight(50 + evaluated);
        else setWHeight(50 - evaluated);
      }
    }
  };

  const convertEvaluation = (ev, turn) => {
    if (ev.startsWith('M')) {
      ev = `M${ev.substring(1)}`
    }
    if (turn === 'b' && !ev.startsWith('M')) {
      if (ev.startsWith('-')) {
        ev = ev.substring(1);
      } else {
        ev = `-${ev}`;
      }
    }
    return ev;
  };

  const evaluateFunc = (x) => {
    if (x === 0) {
      return 0;
    } else if (x < 7) {
      return -(0.322495 * Math.pow(x, 2)) + 7.26599 * x + 4.11834;
    } else {
      return (8 * x) / 145 + 5881 / 145;
    }
  };

  useEffect(() => { setFEN(fen) }, [fen]);
  useEffect(() => {
    stockfish.terminate();
    stockfish = new Worker("/stockfish.js");
    stockfish.postMessage("uci");
    stockfish.postMessage("ucinewgame");
    stockfish.postMessage(`position fen ${FEN}`);
    stockfish.postMessage(`go depth ${depth}`);
    stockfish.onmessage = (event) => {
      onStockfishMsg(event, FEN);
    };
  }, [FEN, depth]);

  return (
    <div key={100} className="md:w-10 w-8 h-full mr-1">
      <div
        style={{ height: `${100 - wHeight}%` }}
        className="w-full bg-black transition ease-in-out duration-700 text-center"
      >
        <span className="text-sm font-bold text-white">
            {wHeight < 50 ? sfEval : ""}
        </span>
      </div>
      <div
        style={{ height: `${wHeight}%` }}
        className="w-full bg-gray-300 transition ease-in-out duration-700 text-center"
      >
        <div style={{ flex: "1" }} />
        <span className="text-sm font-bold text-black">
          {wHeight >= 50 ? sfEval : ""}
        </span>
      </div>
    </div>
  );
};

export default EvalBar;
