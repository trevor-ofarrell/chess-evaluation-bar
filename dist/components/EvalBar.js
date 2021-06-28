"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.starts-with.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.number.to-fixed.js");

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let stockfish = new Worker("/stockfish.js");

const EvalBar = _ref => {
  let {
    fen,
    depth
  } = _ref;
  const [sfEval, setSfEval] = (0, _react.useState)("");
  const [wHeight, setWHeight] = (0, _react.useState)(50);
  const [listening, setListening] = (0, _react.useState)(false);
  const [FEN, setFEN] = (0, _react.useState)(fen);

  const onStockfishMsg = (event, fen) => {
    if (event.data.startsWith("info depth")) {
      let adv;
      let message = event.data.split(" ");
      const turn = fen.slice(-1);
      let evaluation = convertEvaluation(message[message.indexOf("cp") + 1], turn);
      if (evaluation.startsWith("-")) adv = "b";else adv = "w";

      if ((parseFloat(evaluation) / 100).toFixed(1) === 0.0) {
        evaluation = Math.abs(evaluation);
      }

      setSfEval((parseFloat(evaluation) / 100).toFixed(1));
      console.log(sfEval);
      evaluation = Math.abs(parseFloat(evaluation) / 100);
      const evaluated = evaluateFunc(evaluation);
      if (adv === "w") setWHeight(50 + evaluated);else setWHeight(50 - evaluated);
    }
  };

  const convertEvaluation = (ev, turn) => {
    console.log("ev", ev, turn);

    if (turn === "b" && !ev.startsWith("M")) {
      if (ev.startsWith("-")) {
        ev = ev.substring(1);
      } else {
        ev = ev = "-".concat(ev);
      }
    }

    return ev;
  };

  const evaluateFunc = x => {
    if (x === 0) {
      return 0;
    } else if (x < 7) {
      return -(0.322495 * Math.pow(x, 2)) + 7.26599 * x + 4.11834;
    } else {
      return 8 * x / 145 + 5881 / 145;
    }
  };

  (0, _react.useEffect)(() => {
    setFEN(fen);
  }, [fen]);
  (0, _react.useEffect)(() => {
    stockfish.terminate();
    stockfish = new Worker("/stockfish.js");
    stockfish.postMessage("uci");
    stockfish.postMessage("ucinewgame");
    stockfish.postMessage("position fen ".concat(FEN));
    stockfish.postMessage("go depth ".concat(depth));

    stockfish.onmessage = event => {
      onStockfishMsg(event, FEN);
    };
  }, [FEN, depth]);
  return /*#__PURE__*/_react.default.createElement("div", {
    key: 100,
    className: "md:w-10 w-8 h-full mr-1"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: "".concat(100 - wHeight, "%")
    },
    className: "w-full bg-black transition ease-in-out duration-700 text-center"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "text-sm font-bold text-white"
  }, wHeight < 50 ? sfEval : "")), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: "".concat(wHeight, "%")
    },
    className: "w-full bg-gray-300 transition ease-in-out duration-700 text-center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: "1"
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text-sm font-bold text-black"
  }, wHeight >= 50 ? sfEval : "")));
};

var _default = EvalBar;
exports.default = _default;