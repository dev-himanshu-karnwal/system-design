// Observer Pattern Interface
interface IObserver {
  update(msg: string): void;
}

// Sample observer implementation
class SnakeAndLadderConsoleNotifier implements IObserver {
  update(msg: string): void {
    console.log(`[NOTIFICATION] ${msg}`);
  }
}

// Dice class
class Dice {
  private faces: number;

  constructor(faces: number) {
    this.faces = faces;
  }

  roll(): number {
    return Math.floor(Math.random() * this.faces) + 1;
  }
}

// Base class for Snake and Ladder
abstract class BoardEntity {
  protected startPosition: number;
  protected endPosition: number;

  constructor(start: number, end: number) {
    this.startPosition = start;
    this.endPosition = end;
  }

  getStart(): number {
    return this.startPosition;
  }

  getEnd(): number {
    return this.endPosition;
  }

  abstract display(): void;
  abstract name(): string;
}

// Snake class
class Snake extends BoardEntity {
  constructor(start: number, end: number) {
    super(start, end);
    if (end >= start) {
      console.log("Invalid snake! End must be less than start.");
    }
  }

  display(): void {
    console.log(`Snake: ${this.startPosition} -> ${this.endPosition}`);
  }

  name(): string {
    return "SNAKE";
  }
}

// Ladder class
class Ladder extends BoardEntity {
  constructor(start: number, end: number) {
    super(start, end);
    if (end <= start) {
      console.log("Invalid ladder! End must be greater than start.");
    }
  }

  display(): void {
    console.log(`Ladder: ${this.startPosition} -> ${this.endPosition}`);
  }

  name(): string {
    return "LADDER";
  }
}

// Strategy Pattern for Board Setup
interface BoardSetupStrategy {
  setupBoard(board: Board): void;
}

// Random Strategy with difficulty levels
class RandomBoardSetupStrategy implements BoardSetupStrategy {
  static Difficulty = {
    EASY: "EASY", // More ladders, fewer snakes
    MEDIUM: "MEDIUM", // Equal snakes and ladders
    HARD: "HARD", // More snakes, fewer ladders
  } as const;

  private difficulty: keyof typeof RandomBoardSetupStrategy.Difficulty;

  private setupWithProbability(board: Board, snakeProbability: number): void {
    const boardSize = board.getBoardSize();
    const totalEntities = Math.floor(boardSize / 10); // Roughly 10% of board has entities

    for (let i = 0; i < totalEntities; i++) {
      const prob = Math.random();

      if (prob < snakeProbability) {
        // Add snake
        let attempts = 0;
        while (attempts < 50) {
          const start = Math.floor(Math.random() * (boardSize - 10)) + 10;
          const end = Math.floor(Math.random() * (start - 1)) + 1;

          if (board.canAddEntity(start)) {
            board.addBoardEntity(new Snake(start, end));
            break;
          }
          attempts++;
        }
      } else {
        // Add ladder
        let attempts = 0;
        while (attempts < 50) {
          const start = Math.floor(Math.random() * (boardSize - 10)) + 1;
          const end =
            Math.floor(Math.random() * (boardSize - start)) + start + 1;

          if (board.canAddEntity(start) && end < boardSize) {
            board.addBoardEntity(new Ladder(start, end));
            break;
          }
          attempts++;
        }
      }
    }
  }

  constructor(difficulty: keyof typeof RandomBoardSetupStrategy.Difficulty) {
    this.difficulty = difficulty;
  }

  setupBoard(board: Board): void {
    switch (this.difficulty) {
      case RandomBoardSetupStrategy.Difficulty.EASY:
        this.setupWithProbability(board, 0.3); // 30% snakes, 70% ladders
        break;
      case RandomBoardSetupStrategy.Difficulty.MEDIUM:
        this.setupWithProbability(board, 0.5); // 50% snakes, 50% ladders
        break;
      case RandomBoardSetupStrategy.Difficulty.HARD:
        this.setupWithProbability(board, 0.7); // 70% snakes, 30% ladders
        break;
    }
  }
}

// Custom Strategy - User provides count
class CustomCountBoardSetupStrategy implements BoardSetupStrategy {
  private numSnakes: number;
  private numLadders: number;
  private randomPositions: boolean;
  private snakePositions: [number, number][];
  private ladderPositions: [number, number][];

  constructor(snakes: number, ladders: number, random: boolean) {
    this.numSnakes = snakes;
    this.numLadders = ladders;
    this.randomPositions = random;
    this.snakePositions = [];
    this.ladderPositions = [];
  }

  addSnakePosition(start: number, end: number): void {
    this.snakePositions.push([start, end]);
  }

  addLadderPosition(start: number, end: number): void {
    this.ladderPositions.push([start, end]);
  }

  setupBoard(board: Board): void {
    if (this.randomPositions) {
      // Random placement with user-defined counts
      const boardSize = board.getBoardSize();

      // Add snakes
      let snakesAdded = 0;
      while (snakesAdded < this.numSnakes) {
        const start = Math.floor(Math.random() * (boardSize - 10)) + 10;
        const end = Math.floor(Math.random() * (start - 1)) + 1;

        if (board.canAddEntity(start)) {
          board.addBoardEntity(new Snake(start, end));
          snakesAdded++;
        }
      }

      // Add ladders
      let laddersAdded = 0;
      while (laddersAdded < this.numLadders) {
        const start = Math.floor(Math.random() * (boardSize - 10)) + 1;
        const end = Math.floor(Math.random() * (boardSize - start)) + start + 1;

        if (board.canAddEntity(start) && end < boardSize) {
          board.addBoardEntity(new Ladder(start, end));
          laddersAdded++;
        }
      }
    } else {
      // User-defined positions
      for (const [start, end] of this.snakePositions) {
        if (board.canAddEntity(start)) {
          board.addBoardEntity(new Snake(start, end));
        }
      }

      for (const [start, end] of this.ladderPositions) {
        if (board.canAddEntity(start)) {
          board.addBoardEntity(new Ladder(start, end));
        }
      }
    }
  }
}

// Standard Board Strategy - Traditional Snake & Ladder positions
class StandardBoardSetupStrategy implements BoardSetupStrategy {
  setupBoard(board: Board): void {
    // Only works for 10x10 board (100 cells)
    if (board.getBoardSize() !== 100) {
      console.log("Standard setup only works for 10x10 board!");
      return;
    }

    // Standard snake positions (based on traditional board)
    board.addBoardEntity(new Snake(99, 54));
    board.addBoardEntity(new Snake(95, 75));
    board.addBoardEntity(new Snake(92, 88));
    board.addBoardEntity(new Snake(89, 68));
    board.addBoardEntity(new Snake(74, 53));
    board.addBoardEntity(new Snake(64, 60));
    board.addBoardEntity(new Snake(62, 19));
    board.addBoardEntity(new Snake(49, 11));
    board.addBoardEntity(new Snake(46, 25));
    board.addBoardEntity(new Snake(16, 6));

    // Standard ladder positions
    board.addBoardEntity(new Ladder(2, 38));
    board.addBoardEntity(new Ladder(7, 14));
    board.addBoardEntity(new Ladder(8, 31));
    board.addBoardEntity(new Ladder(15, 26));
    board.addBoardEntity(new Ladder(21, 42));
    board.addBoardEntity(new Ladder(28, 84));
    board.addBoardEntity(new Ladder(36, 44));
    board.addBoardEntity(new Ladder(51, 67));
    board.addBoardEntity(new Ladder(71, 91));
    board.addBoardEntity(new Ladder(78, 98));
    board.addBoardEntity(new Ladder(87, 94));
  }
}

// Board class
class Board {
  private size: number;
  private snakesAndLadders: BoardEntity[];
  private boardEntities: Map<number, BoardEntity>;

  constructor(size: number) {
    this.size = size * size; // m*m board
    this.snakesAndLadders = [];
    this.boardEntities = new Map();
  }

  canAddEntity(position: number): boolean {
    return !this.boardEntities.has(position);
  }

  addBoardEntity(boardEntity: BoardEntity): void {
    if (this.canAddEntity(boardEntity.getStart())) {
      this.snakesAndLadders.push(boardEntity);
      this.boardEntities.set(boardEntity.getStart(), boardEntity);
    }
  }

  setupBoard(strategy: BoardSetupStrategy): void {
    strategy.setupBoard(this);
  }

  getEntity(position: number): BoardEntity | undefined {
    return this.boardEntities.get(position);
  }

  getBoardSize(): number {
    return this.size;
  }

  display(): void {
    console.log("\n=== Board Configuration ===");
    console.log(`Board Size: ${this.size} cells`);

    let snakeCount = 0;
    let ladderCount = 0;
    for (const entity of this.snakesAndLadders) {
      if (entity.name() === "SNAKE") snakeCount++;
      else ladderCount++;
    }

    console.log(`\nSnakes: ${snakeCount}`);
    for (const entity of this.snakesAndLadders) {
      if (entity.name() === "SNAKE") {
        entity.display();
      }
    }

    console.log(`\nLadders: ${ladderCount}`);
    for (const entity of this.snakesAndLadders) {
      if (entity.name() === "LADDER") {
        entity.display();
      }
    }
    console.log("=========================");
  }
}

// Player class
class SnakeAndLadderPlayer {
  private playerId: number;
  private name: string;
  private position: number;
  private score: number;

  constructor(playerId: number, name: string) {
    this.playerId = playerId;
    this.name = name;
    this.position = 0;
    this.score = 0;
  }

  // Getters and Setters
  getName(): string {
    return this.name;
  }
  getPosition(): number {
    return this.position;
  }
  setPosition(pos: number): void {
    this.position = pos;
  }
  getScore(): number {
    return this.score;
  }
  incrementScore(): void {
    this.score++;
  }
}

// Strategy Pattern for game rules
interface SnakeAndLadderRules {
  isValidMove(
    currentPos: number,
    diceValue: number,
    boardSize: number
  ): boolean;
  calculateNewPosition(
    currentPos: number,
    diceValue: number,
    board: Board
  ): number;
  checkWinCondition(position: number, boardSize: number): boolean;
}

// Standard rules
class StandardSnakeAndLadderRules implements SnakeAndLadderRules {
  isValidMove(
    currentPos: number,
    diceValue: number,
    boardSize: number
  ): boolean {
    return currentPos + diceValue <= boardSize;
  }

  calculateNewPosition(
    currentPos: number,
    diceValue: number,
    board: Board
  ): number {
    const newPos = currentPos + diceValue;
    const entity = board.getEntity(newPos);

    if (entity !== undefined) {
      return entity.getEnd();
    }
    return newPos;
  }

  checkWinCondition(position: number, boardSize: number): boolean {
    return position === boardSize;
  }
}

// Game class
class SnakeAndLadderGame {
  private board: Board;
  private dice: Dice;
  private players: SnakeAndLadderPlayer[];
  private rules: SnakeAndLadderRules;
  private observers: IObserver[];
  private gameOver: boolean;

  constructor(board: Board, dice: Dice) {
    this.board = board;
    this.dice = dice;
    this.rules = new StandardSnakeAndLadderRules();
    this.gameOver = false;
    this.players = [];
    this.observers = [];
  }

  addPlayer(player: SnakeAndLadderPlayer): void {
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

  private displayPlayerPositions(): void {
    console.log("\n=== Current Positions ===");
    for (const player of this.players) {
      console.log(`${player.getName()}: ${player.getPosition()}`);
    }
    console.log("======================");
  }

  async play(): Promise<void> {
    if (this.players.length < 2) {
      console.log("Need at least 2 players!");
      return;
    }

    this.notify("Game started");
    this.board.display();

    while (!this.gameOver) {
      const currentPlayer = this.players[0];

      console.log(
        `\n${currentPlayer.getName()}'s turn. Press Enter to roll dice...`
      );
      // In a real app, you would wait for actual user input here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      const diceValue = this.dice.roll();
      console.log(`Rolled: ${diceValue}`);

      const currentPos = currentPlayer.getPosition();

      if (
        this.rules.isValidMove(currentPos, diceValue, this.board.getBoardSize())
      ) {
        const intermediatePos = currentPos + diceValue;
        const newPos = this.rules.calculateNewPosition(
          currentPos,
          diceValue,
          this.board
        );

        currentPlayer.setPosition(newPos);

        // Check if player encountered snake or ladder
        const entity = this.board.getEntity(intermediatePos);
        if (entity !== undefined) {
          const isSnake = entity.name() === "SNAKE";
          if (isSnake) {
            console.log(
              `Oh no! Snake at ${intermediatePos}! Going down to ${newPos}`
            );
            this.notify(
              `${currentPlayer.getName()} encountered snake at ${intermediatePos} now going down to ${newPos}`
            );
          } else {
            console.log(
              `Great! Ladder at ${intermediatePos}! Going up to ${newPos}`
            );
            this.notify(
              `${currentPlayer.getName()} encountered ladder at ${intermediatePos} now going up to ${newPos}`
            );
          }
        }

        this.notify(
          `${currentPlayer.getName()} played. New Position: ${newPos}`
        );
        this.displayPlayerPositions();

        if (this.rules.checkWinCondition(newPos, this.board.getBoardSize())) {
          console.log(`\n${currentPlayer.getName()} wins!`);
          currentPlayer.incrementScore();

          this.notify(`Game Ended. Winner is: ${currentPlayer.getName()}`);
          this.gameOver = true;
        } else {
          // Rotate players
          this.players.push(this.players.shift()!);
        }
      } else {
        console.log(`Need exact roll to reach ${this.board.getBoardSize()}!`);
        // Rotate players
        this.players.push(this.players.shift()!);
      }
    }
  }
}

// Factory Pattern
class SnakeAndLadderGameFactory {
  static createStandardGame(): SnakeAndLadderGame {
    const board = new Board(10); // Standard 10x10 board
    const strategy = new StandardBoardSetupStrategy();
    board.setupBoard(strategy);

    const dice = new Dice(6); // Standard 6-faced dice

    return new SnakeAndLadderGame(board, dice);
  }

  static createRandomGame(
    boardSize: number,
    difficulty: keyof typeof RandomBoardSetupStrategy.Difficulty
  ): SnakeAndLadderGame {
    const board = new Board(boardSize);
    const strategy = new RandomBoardSetupStrategy(difficulty);
    board.setupBoard(strategy);

    const dice = new Dice(6);

    return new SnakeAndLadderGame(board, dice);
  }

  static createCustomGame(
    boardSize: number,
    strategy: BoardSetupStrategy
  ): SnakeAndLadderGame {
    const board = new Board(boardSize);
    board.setupBoard(strategy);

    const dice = new Dice(6);

    return new SnakeAndLadderGame(board, dice);
  }
}

// Main function for Snake and Ladder
function main() {
  console.log("=== SNAKE AND LADDER GAME ===");

  let game: SnakeAndLadderGame | null = null;
  let board: Board | null = null;

  console.log("Choose game setup:");
  console.log("1. Standard Game (10x10 board with traditional positions)");
  console.log("2. Random Game with Difficulty");
  console.log("3. Custom Game");

  // Simulating user choice (in a real app, you'd use actual input)
  const choice = 1; // Default to standard game

  if (choice === 1) {
    // Standard game
    game = SnakeAndLadderGameFactory.createStandardGame();
    board = new Board(10);
  } else if (choice === 2) {
    // Random game with difficulty
    const boardSize = 10; // Default size
    console.log(`Creating ${boardSize}x${boardSize} board`);

    const diffChoice: number = 2; // Default to medium
    let diff: keyof typeof RandomBoardSetupStrategy.Difficulty;

    switch (diffChoice) {
      case 1:
        diff = RandomBoardSetupStrategy.Difficulty.EASY;
        break;
      case 2:
        diff = RandomBoardSetupStrategy.Difficulty.MEDIUM;
        break;
      case 3:
        diff = RandomBoardSetupStrategy.Difficulty.HARD;
        break;
      default:
        diff = RandomBoardSetupStrategy.Difficulty.MEDIUM;
    }

    game = SnakeAndLadderGameFactory.createRandomGame(boardSize, diff);
    board = new Board(boardSize);
  } else if (choice === 3) {
    // Custom game
    const boardSize = 10; // Default size
    console.log(`Creating ${boardSize}x${boardSize} board`);

    const customChoice = 1; // Default to random placement
    const numSnakes = 5;
    const numLadders = 5;

    if (customChoice === 1) {
      const strategy = new CustomCountBoardSetupStrategy(
        numSnakes,
        numLadders,
        true
      );
      game = SnakeAndLadderGameFactory.createCustomGame(boardSize, strategy);
    } else {
      const strategy = new CustomCountBoardSetupStrategy(
        numSnakes,
        numLadders,
        false
      );

      // Add sample snake positions
      strategy.addSnakePosition(99, 54);
      strategy.addSnakePosition(95, 75);

      // Add sample ladder positions
      strategy.addLadderPosition(2, 38);
      strategy.addLadderPosition(7, 14);

      game = SnakeAndLadderGameFactory.createCustomGame(boardSize, strategy);
    }

    board = new Board(boardSize);
  }

  if (game === null) {
    console.log("Invalid choice!");
    return;
  }

  // Add observer
  const notifier = new SnakeAndLadderConsoleNotifier();
  game.addObserver(notifier);

  // Create players
  const numPlayers = 2; // Default to 2 players
  const player1 = new SnakeAndLadderPlayer(1, "Aditya");
  const player2 = new SnakeAndLadderPlayer(2, "Harshita");

  game.addPlayer(player1);
  game.addPlayer(player2);

  // Play the game
  game.play();
}

main();

export {};
