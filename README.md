# Chess-Evaluation-Bar

A browser based Stockfish 11 engine analysis React component. Pass the component a FEN of the postion, and the depth of which to search.

  
  

<p  align="center">

<img src="https://github.com/trevor-ofarrell/chess-evaluation-bar/blob/main/public/appdemo.gif?raw=true"  alt="My Project GIF"  width="auto"  height="auto">

</p>

  

## About

- Uses stockfish.js for the analysis

  

## Usage

```
npm install chess-evaluation-bar
```
or install with yarn
```
yarn add chess-evaluation-bar
```

how to use in React:

	import { EvalBar } from "chess-evaluation-bar";

	const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
	
	export const eval = () => {
		return(
			<EvalBar fen={fen} depth={25}/>
		)
	}

  
  

## Contributing

  

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  

Please make sure to update tests as appropriate.

  

## License

  

[MIT](https://choosealicense.com/licenses/mit/)