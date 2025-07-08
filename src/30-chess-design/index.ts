// Enums for better type safety
enum Color {
  WHITE,
  BLACK,
}

enum PieceType {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
}

enum GameStatus {
  WAITING,
  IN_PROGRESS,
  COMPLETED,
  ABORTED,
}

// Position class to represent coordinates
class Position {
  readonly row: number;
  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  toChessNotation(): string {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return `${letters[this.col]}${8 - this.row}`;
  }

  equals(other: Position): boolean {
    return this.row === other.row && this.col === other.col;
  }
}

// Move class to represent a chess move
class Move {
  constructor(
    private readonly from: Position,
    private readonly to: Position,
    private readonly piece: Piece,
    private readonly capturedPiece: Piece | null = null
  ) {}
}

// Abstract Piece class following Strategy Pattern
abstract class Piece {
  protected readonly color: Color;
  protected readonly type: PieceType;

  constructor(color: Color, type: PieceType) {
    this.color = color;
    this.type = type;
  }

  abstract getPossibleMoves(currentPos: Position, board: Board): Position[];

  getColor(): Color {
    return this.color;
  }

  getType(): PieceType {
    return this.type;
  }

  getSymbol(): string {
    const symbols = {
      [Color.WHITE]: {
        [PieceType.KING]: "♔",
        [PieceType.QUEEN]: "♕",
        [PieceType.ROOK]: "♖",
        [PieceType.BISHOP]: "♗",
        [PieceType.KNIGHT]: "♘",
        [PieceType.PAWN]: "♙",
      },
      [Color.BLACK]: {
        [PieceType.KING]: "♚",
        [PieceType.QUEEN]: "♛",
        [PieceType.ROOK]: "♜",
        [PieceType.BISHOP]: "♝",
        [PieceType.KNIGHT]: "♞",
        [PieceType.PAWN]: "♟",
      },
    };
    return symbols[this.color][this.type];
  }
}

// Concrete Piece implementations
class King extends Piece {
  constructor(color: Color) {
    super(color, PieceType.KING);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement king movement logic
    return moves;
  }
}

class Queen extends Piece {
  constructor(color: Color) {
    super(color, PieceType.QUEEN);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement queen movement logic
    return moves;
  }
}

class Rook extends Piece {
  constructor(color: Color) {
    super(color, PieceType.ROOK);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement rook movement logic
    return moves;
  }
}

class Bishop extends Piece {
  constructor(color: Color) {
    super(color, PieceType.BISHOP);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement bishop movement logic
    return moves;
  }
}

class Knight extends Piece {
  constructor(color: Color) {
    super(color, PieceType.KNIGHT);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement knight movement logic
    return moves;
  }
}

class Pawn extends Piece {
  constructor(color: Color) {
    super(color, PieceType.PAWN);
  }

  getPossibleMoves(currentPos: Position, board: Board): Position[] {
    const moves: Position[] = [];
    // Implement pawn movement logic
    return moves;
  }
}

// Factory Pattern for creating pieces
class PieceFactory {
  static createPiece(type: PieceType, color: Color): Piece {
    switch (type) {
      case PieceType.KING:
        return new King(color);
      case PieceType.QUEEN:
        return new Queen(color);
      case PieceType.ROOK:
        return new Rook(color);
      case PieceType.BISHOP:
        return new Bishop(color);
      case PieceType.KNIGHT:
        return new Knight(color);
      case PieceType.PAWN:
        return new Pawn(color);
      default:
        throw new Error("Invalid piece type");
    }
  }
}

// Board class - Dumb object that manages pieces
class Board {
  private grid: (Piece | null)[][];

  constructor() {
    this.grid = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Initialize pawns
    for (let col = 0; col < 8; col++) {
      this.grid[1][col] = PieceFactory.createPiece(PieceType.PAWN, Color.BLACK);
      this.grid[6][col] = PieceFactory.createPiece(PieceType.PAWN, Color.WHITE);
    }

    // Initialize other pieces
    const pieceOrder = [
      PieceType.ROOK,
      PieceType.KNIGHT,
      PieceType.BISHOP,
      PieceType.QUEEN,
      PieceType.KING,
      PieceType.BISHOP,
      PieceType.KNIGHT,
      PieceType.ROOK,
    ];

    for (let col = 0; col < 8; col++) {
      this.grid[0][col] = PieceFactory.createPiece(
        pieceOrder[col],
        Color.BLACK
      );
      this.grid[7][col] = PieceFactory.createPiece(
        pieceOrder[col],
        Color.WHITE
      );
    }
  }

  getPiece(position: Position): Piece | null {
    return this.grid[position.row][position.col];
  }

  movePiece(from: Position, to: Position): void {
    const piece = this.grid[from.row][from.col];
    if (!piece) return;

    this.grid[to.row][to.col] = piece;
    this.grid[from.row][from.col] = null;
  }

  display(): void {
    console.log("\n  a b c d e f g h");
    console.log(" +-----------------+");

    for (let row = 0; row < 8; row++) {
      let rowStr = `${8 - row}|`;
      for (let col = 0; col < 8; col++) {
        const piece = this.grid[row][col];
        rowStr += piece ? piece.getSymbol() : "·";
        rowStr += " ";
      }
      rowStr += `|${8 - row}`;
      console.log(rowStr);
    }

    console.log(" +-----------------+");
    console.log("  a b c d e f g h\n");
  }
}

// Chess Rules interface
interface ChessRules {
  isValidMove(move: Move, board: Board): boolean;
  isCheckmate(color: Color, board: Board): boolean;
  isStalemate(color: Color, board: Board): boolean;
  isInCheck(color: Color, board: Board): boolean;
}

class StandardChessRules implements ChessRules {
  isValidMove(move: Move, board: Board): boolean {
    // Basic validation (actual chess rules would be more complex)
    return true;
  }

  isCheckmate(color: Color, board: Board): boolean {
    // Simplified checkmate detection
    return false;
  }

  isStalemate(color: Color, board: Board): boolean {
    // Simplified stalemate detection
    return false;
  }

  isInCheck(color: Color, board: Board): boolean {
    // Simplified check detection
    return false;
  }
}

// Message class for chat functionality
class Message {
  constructor(
    public senderId: string,
    public content: string,
    public timestamp: Date = new Date()
  ) {}

  getContent(): string {
    return this.content;
  }
}

// Mediator Pattern - Interface
interface ChatMediator {
  sendMessage(message: Message, user: User): void;
  addUser(user: User): void;
  removeUser(user: User): void;
}

// Colleague interface for Mediator Pattern
interface Colleague {
  setMediator(mediator: ChatMediator): void;
  send(message: Message): void;
  receive(message: Message): void;
}

// User class implementing Colleague for Mediator Pattern
class User implements Colleague {
  private mediator: ChatMediator | null = null;
  private score: number = 1000;

  constructor(public readonly id: string, public readonly name: string) {}

  setMediator(mediator: ChatMediator): void {
    this.mediator = mediator;
  }

  send(message: Message): void {
    if (this.mediator) {
      this.mediator.sendMessage(message, this);
    }
  }

  receive(message: Message): void {
    console.log(`${this.name} received: ${message.getContent()}`);
  }

  incrementScore(points: number): void {
    this.score += points;
  }

  decrementScore(points: number): void {
    this.score = Math.max(0, this.score - points);
  }

  getName(): string {
    return this.name;
  }

  getId(): string {
    return this.id;
  }

  getScore(): number {
    return this.score;
  }

  toString(): string {
    return `${this.name} (Score: ${this.score})`;
  }
}

// Match class implementing Mediator Pattern
class Match implements ChatMediator {
  private matchId: string;
  private whitePlayer: User;
  private blackPlayer: User;
  private board: Board;
  private rules: ChessRules;
  private currentTurn: Color;
  private status: GameStatus;
  private moveHistory: Move[];
  private chatHistory: Message[];

  constructor(matchId: string, white: User, black: User) {
    this.matchId = matchId;
    this.whitePlayer = white;
    this.blackPlayer = black;
    this.board = new Board();
    this.rules = new StandardChessRules();
    this.currentTurn = Color.WHITE;
    this.status = GameStatus.IN_PROGRESS;
    this.moveHistory = [];
    this.chatHistory = [];

    // Set mediator for both users
    this.whitePlayer.setMediator(this);
    this.blackPlayer.setMediator(this);

    console.log(
      `Match started between ${this.whitePlayer.getName()} (White) and ${this.blackPlayer.getName()} (Black)`
    );
  }

  makeMove(from: Position, to: Position, player: User): boolean {
    if (this.status !== GameStatus.IN_PROGRESS) {
      console.log("Game is not in progress!");
      return false;
    }

    const playerColor = this.getPlayerColor(player);
    if (playerColor !== this.currentTurn) {
      console.log("It's not your turn!");
      return false;
    }

    const piece = this.board.getPiece(from);
    if (!piece || piece.getColor() !== playerColor) {
      console.log("Invalid piece selection!");
      return false;
    }

    const move = new Move(from, to, piece, this.board.getPiece(to));

    if (!this.rules.isValidMove(move, this.board)) {
      console.log("Invalid move!");
      return false;
    }

    // Execute move
    this.board.movePiece(from, to);
    this.moveHistory.push(move);

    console.log(
      `${player.getName()} moved ${piece.getSymbol()} from ${from.toChessNotation()} to ${to.toChessNotation()}`
    );

    this.board.display();

    // Check game end conditions
    const opponentColor =
      this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
    if (this.rules.isCheckmate(opponentColor, this.board)) {
      this.endGame(player, "checkmate");
      return true;
    } else if (this.rules.isStalemate(opponentColor, this.board)) {
      this.endGame(null, "stalemate");
      return true;
    } else {
      this.currentTurn = opponentColor;
      if (this.rules.isInCheck(opponentColor, this.board)) {
        console.log(
          `${this.getPlayerByColor(opponentColor)?.getName()} is in check!`
        );
      }
    }

    return true;
  }

  quitGame(player: User): void {
    const opponent =
      player === this.whitePlayer ? this.blackPlayer : this.whitePlayer;
    this.endGame(opponent, "quit");
    player.decrementScore(50); // Penalty for quitting
    console.log(`${player.getName()} quit the game. Score decreased by 50.`);
  }

  endGame(winner: User | null, reason: string): void {
    this.status = GameStatus.COMPLETED;

    if (winner) {
      const loser =
        winner === this.whitePlayer ? this.blackPlayer : this.whitePlayer;
      winner.incrementScore(30);
      loser.decrementScore(20);
      console.log(`Game ended - ${winner.getName()} wins by ${reason}!`);
      console.log(
        `Score update: ${winner.getName()} +30, ${loser.getName()} -20`
      );
    } else {
      console.log(`Game ended in ${reason}! No score change.`);
    }
  }

  getPlayerColor(player: User): Color {
    return player === this.whitePlayer ? Color.WHITE : Color.BLACK;
  }

  getPlayerByColor(color: Color): User | null {
    return color === Color.WHITE ? this.whitePlayer : this.blackPlayer;
  }

  // Mediator Pattern implementation
  sendMessage(message: Message, user: User): void {
    this.chatHistory.push(message);

    const recipient =
      user === this.whitePlayer ? this.blackPlayer : this.whitePlayer;
    recipient.receive(message);
    console.log(`Chat in match ${this.matchId} - ${message.getContent()}`);
  }

  addUser(user: User): void {
    // Not applicable for chess match (always 2 users)
  }

  removeUser(user: User): void {
    this.quitGame(user);
  }

  getMatchId(): string {
    return this.matchId;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getWhitePlayer(): User {
    return this.whitePlayer;
  }

  getBlackPlayer(): User {
    return this.blackPlayer;
  }

  getBoard(): Board {
    return this.board;
  }
}

// Matching Strategy interface
interface MatchingStrategy {
  matchUsers(users: User[]): [User, User] | null;
}

// Score-based matching strategy
class ScoreBasedMatching implements MatchingStrategy {
  matchUsers(users: User[]): [User, User] | null {
    if (users.length < 2) return null;

    // Sort by score and pair closest scores
    const sorted = [...users].sort((a, b) => a.getScore() - b.getScore());

    // Find the pair with smallest score difference
    let minDiff = Infinity;
    let bestPair: [User, User] | null = null;

    for (let i = 0; i < sorted.length - 1; i++) {
      const diff = Math.abs(sorted[i].getScore() - sorted[i + 1].getScore());
      if (diff < minDiff) {
        minDiff = diff;
        bestPair = [sorted[i], sorted[i + 1]];
      }
    }

    return bestPair;
  }
}

// Game Manager - Singleton Pattern
class GameManager {
  private static instance: GameManager | null = null;
  private users: User[] = [];
  private waitingList: User[] = [];
  private activeMatches: Match[] = [];
  private matchingStrategy: MatchingStrategy = new ScoreBasedMatching();

  private constructor() {}

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  requestMatch(user: User): void {
    if (this.waitingList.includes(user)) {
      console.log(`${user.getName()} is already in the waiting list`);
      return;
    }

    this.waitingList.push(user);
    console.log(`${user.getName()} joined the waiting list`);

    if (this.waitingList.length >= 2) {
      const match = this.matchingStrategy.matchUsers(this.waitingList);
      if (match) {
        const [player1, player2] = match;
        this.waitingList = this.waitingList.filter(
          (u) => u !== player1 && u !== player2
        );

        const matchId = `MATCH_${Date.now()}`;
        const newMatch = new Match(matchId, player1, player2);
        this.activeMatches.push(newMatch);

        console.log(
          `Created new match between ${player1.getName()} and ${player2.getName()}`
        );
      }
    }
  }

  displayActiveMatches(): void {
    console.log("\n=== Active Matches ===");
    if (this.activeMatches.length === 0) {
      console.log("No active matches");
      return;
    }

    this.activeMatches.forEach((match) => {
      const status = GameStatus[match.getStatus()]
        .toLowerCase()
        .replace("_", " ");
      console.log(
        `${match.getMatchId()}: ${match.getWhitePlayer().getName()} vs ${match
          .getBlackPlayer()
          .getName()} - ${status}`
      );
    });
  }

  getActiveMatches(): Match[] {
    return this.activeMatches;
  }

  getWaitingList(): User[] {
    return this.waitingList;
  }

  registerUser(user: User): void {
    this.users.push(user);
  }
}

// Util class for basic demo
class ChessSystemDemo {
  // Method to demonstrate Scholar's Mate (4-move checkmate)
  static demonstrateScholarsMate(): void {
    console.log("\n=== Scholar's Mate Demo (4-move checkmate) ===");

    const aditya = new User("DEMO_1", "Aditya");
    const rohit = new User("DEMO_2", "Rohit");

    const demoMatch = new Match("DEMO_MATCH", aditya, rohit);
    demoMatch.getBoard().display();

    // Proper Scholar's Mate sequence with correct coordinates
    console.log("\nMove 1: White e2-e4");
    demoMatch.makeMove(new Position(6, 4), new Position(4, 4), aditya); // e2-e4

    console.log("\nMove 1: Black e7-e5");
    demoMatch.makeMove(new Position(1, 4), new Position(3, 4), rohit); // e7-e5

    console.log("\nMove 2: White Bf1-c4 (targeting f7)");
    demoMatch.makeMove(new Position(7, 5), new Position(4, 2), aditya); // Bf1-c4

    console.log("\nMove 2: Black Nb8-c6 (developing)");
    demoMatch.makeMove(new Position(0, 1), new Position(2, 2), rohit); // Nb8-c6

    console.log("\nMove 3: White Qd1-h5 (attacking f7 and h7)");
    demoMatch.makeMove(new Position(7, 3), new Position(3, 7), aditya); // Qd1-h5 (row 3, col 7 = h5)

    console.log("\nMove 3: Black Ng8-f6?? (defending h7 but exposing f7)");
    demoMatch.makeMove(new Position(0, 6), new Position(2, 5), rohit); // Ng8-f6

    console.log("\nMove 4: White Qh5xf7# (Checkmate!)");
    const gameEnded = demoMatch.makeMove(
      new Position(3, 7),
      new Position(1, 5),
      aditya
    ); // Qh5xf7#

    if (demoMatch.getStatus() !== GameStatus.COMPLETED) {
      console.log(
        "Note: Checkmate detection may need refinement for this position."
      );
    }

    // Demonstrate chat functionality
    console.log("\n=== Testing Chat Functionality ===");
    aditya.send(new Message(aditya.getId(), "Good game!"));
    rohit.send(new Message(rohit.getId(), "Thanks, that was a quick one!"));
  }
}

// Main function to run the chess system
function main() {
  console.log("=== Chess System with Design Patterns Demo ===");

  // Test Scholar's Mate
  ChessSystemDemo.demonstrateScholarsMate();

  // Demonstrate Game Manager functionality
  console.log("\n=== Game Manager Demo ===");
  const gm = GameManager.getInstance();

  const saurav = new User("USER_1", "Saurav");
  const manish = new User("USER_2", "Manish");
  const abhishek = new User("USER_3", "Abishek");

  console.log(
    `\nUsers: ${saurav.toString()}, ${manish.toString()}, ${abhishek.toString()}`
  );

  // Request matches
  gm.requestMatch(saurav);
  gm.requestMatch(manish); // Should create a match
  gm.requestMatch(abhishek); // Should go to waiting list

  gm.displayActiveMatches();
}

main();

export {};
