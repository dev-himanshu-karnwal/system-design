// Observer Pattern Interface
interface IObserver {
  update(msg: string): void;
}

// Sample observer implementation
class ConsoleNotifier implements IObserver {
  update(msg: string): void {
    console.log(`[Notification] ${msg}`);
  }
}

// Symbol/Mark class
class Symbol {
  private readonly mark: string;

  constructor(m: string) {
    this.mark = m;
  }

  getMark(): string {
    return this.mark;
  }
}

// Board class - Dumb object that only manages the grid
class Board {
  private readonly grid: Symbol[][];
  private readonly size: number;
  private readonly emptyCell: Symbol;

  constructor(size: number) {
    this.size = size;
    this.emptyCell = new Symbol("-");
    this.grid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(this.emptyCell));
  }

  isCellEmpty(row: number, col: number): boolean {
    if (!this.isValidCell(row, col)) return false;

    return this.grid[row][col] === this.emptyCell;
  }

  placeMark(row: number, col: number, mark: Symbol): boolean {
    if (!this.isValidCell(row, col)) return false;
    if (!this.isCellEmpty(row, col)) return false;

    this.grid[row][col] = mark;
    return true;
  }

  getCell(row: number, col: number): Symbol {
    if (!this.isValidCell(row, col)) {
      return this.emptyCell;
    }

    return this.grid[row][col];
  }

  isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getSize(): number {
    return this.size;
  }

  getEmptyCell(): Symbol {
    return this.emptyCell;
  }

  display(): void {
    let output = "\n  ";
    for (let i = 0; i < this.size; i++) {
      output += `${i} `;
    }
    output += "\n";

    for (let i = 0; i < this.size; i++) {
      output += `${i} `;
      for (let j = 0; j < this.size; j++) {
        output += `${this.grid[i][j].getMark()} `;
      }
      output += "\n";
    }
    console.log(output);
  }
}

// Player class
class TicTacToePlayer {
  private readonly playerId: number;
  private readonly name: string;
  private readonly symbol: Symbol;
  private score: number;

  constructor(playerId: number, name: string, symbol: Symbol) {
    this.playerId = playerId;
    this.name = name;
    this.symbol = symbol;
    this.score = 0;
  }

  // Getters
  getName(): string {
    return this.name;
  }

  getSymbol(): Symbol {
    return this.symbol;
  }

  getScore(): number {
    return this.score;
  }

  incrementScore(): void {
    this.score++;
  }
}

// Strategy Pattern for game rules
interface TicTacToeRules {
  isValidMove(board: Board, row: number, col: number): boolean;
  checkWinCondition(board: Board, symbol: Symbol): boolean;
  checkDrawCondition(board: Board): boolean;
}

// Standard Tic Tac Toe rules
class StandardTicTacToeRules implements TicTacToeRules {
  isValidMove(board: Board, row: number, col: number): boolean {
    return board.isCellEmpty(row, col);
  }

  checkWinCondition(board: Board, symbol: Symbol): boolean {
    const size = board.getSize();

    // Check rows
    for (let i = 0; i < size; i++) {
      let win = true;
      for (let j = 0; j < size; j++) {
        if (board.getCell(i, j) !== symbol) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }

    // Check columns
    for (let j = 0; j < size; j++) {
      let win = true;
      for (let i = 0; i < size; i++) {
        if (board.getCell(i, j) !== symbol) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }

    // Check main diagonal
    let win = true;
    for (let i = 0; i < size; i++) {
      if (board.getCell(i, i) !== symbol) {
        win = false;
        break;
      }
    }
    if (win) return true;

    // Check anti-diagonal
    win = true;
    for (let i = 0; i < size; i++) {
      if (board.getCell(i, size - 1 - i) !== symbol) {
        win = false;
        break;
      }
    }
    return win;
  }

  // If all cells are filled and no winner
  checkDrawCondition(board: Board): boolean {
    const size = board.getSize();
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board.getCell(i, j) === board.getEmptyCell()) {
          return false;
        }
      }
    }
    return true;
  }
}

// Game class --> Observable
class TicTacToeGame {
  private readonly board: Board;
  private readonly players: TicTacToePlayer[];
  private readonly rules: TicTacToeRules;
  private readonly observers: IObserver[];
  private gameOver: boolean;

  constructor(boardSize: number) {
    this.board = new Board(boardSize);
    this.rules = new StandardTicTacToeRules();
    this.gameOver = false;
    this.players = [];
    this.observers = [];
  }

  addPlayer(player: TicTacToePlayer): void {
    this.players.push(player);
  }

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  private notify(msg: string): void {
    for (const observer of this.observers) {
      observer.update(msg);
    }
  }

  play() {
    if (this.players.length < 2) {
      console.log("Need at least 2 players!");
      return;
    }

    this.notify("Tic Tac Toe Game Started!");

    while (!this.gameOver) {
      this.board.display();

      // Get current player
      const currentPlayer = this.players[0];
      console.log(
        `${currentPlayer.getName()} (${currentPlayer
          .getSymbol()
          .getMark()}) - Enter row and column: `
      );

      // Simulating user input (in a real app, you'd use actual input)
      const row = Math.floor(Math.random() * this.board.getSize());
      const col = Math.floor(Math.random() * this.board.getSize());
      console.log(`Player chose: ${row}, ${col}`);

      // check if move is valid
      if (this.rules.isValidMove(this.board, row, col)) {
        this.board.placeMark(row, col, currentPlayer.getSymbol());
        this.notify(`${currentPlayer.getName()} played (${row},${col})`);

        if (
          this.rules.checkWinCondition(this.board, currentPlayer.getSymbol())
        ) {
          this.board.display();
          console.log(`${currentPlayer.getName()} wins!`);
          currentPlayer.incrementScore();

          this.notify(`${currentPlayer.getName()} wins!`);

          this.gameOver = true;
        } else if (this.rules.checkDrawCondition(this.board)) {
          this.board.display();

          console.log("It's a draw!");
          this.notify("Game is Draw!");

          this.gameOver = true;
        } else {
          // Rotate players
          this.players.push(this.players.shift()!);
        }
      } else {
        console.log("Invalid move! Try again.");
      }
    }
  }
}

// Enum & Factory Pattern for game creation
enum GameType {
  STANDARD,
}

class TicTacToeGameFactory {
  static createGame(gt: GameType, boardSize: number): TicTacToeGame {
    if (GameType.STANDARD === gt) {
      return new TicTacToeGame(boardSize);
    }
    throw new Error("Invalid game type");
  }
}

// Main function for Tic Tac Toe
function main() {
  console.log("=== TIC TAC TOE GAME ===");

  // Create game with custom board size
  const boardSize = 3; // Default size
  console.log(`Creating ${boardSize}x${boardSize} board`);

  const game = TicTacToeGameFactory.createGame(GameType.STANDARD, boardSize);

  // Add observer
  const notifier = new ConsoleNotifier();
  game.addObserver(notifier);

  // Create players with custom symbols
  const player1 = new TicTacToePlayer(1, "Aditya", new Symbol("X"));
  const player2 = new TicTacToePlayer(2, "Harshita", new Symbol("O"));

  game.addPlayer(player1);
  game.addPlayer(player2);

  // Play the game
  game.play();
}

// Run the program
main();

export {};
