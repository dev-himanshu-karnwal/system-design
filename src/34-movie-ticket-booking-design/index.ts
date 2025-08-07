enum SeatType {
  NORMAL = "normal",
  PREMIUM = "premium",
  VIP = "vip",
}

enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

class Movie {
  constructor(
    private id: number,
    private name: string,
    private duration: number // in minutes
  ) {}

  getDetails() {
    return `${this.name} (${this.duration} mins)`;
  }
}

class Theatre {
  constructor(
    private id: number,
    private name: string,
    private location: string
  ) {}

  getInfo() {
    return `${this.name} - ${this.location}`;
  }
}

class Screen {
  constructor(
    private id: number,
    private name: string,
    private theatre: Theatre,
    private capacity: number
  ) {}

  getTheatre() {
    return this.theatre;
  }
}

class Seat {
  constructor(
    private id: number,
    private screen: Screen,
    private row: string,
    private number: number,
    private type: SeatType = SeatType.NORMAL
  ) {}

  getSeatLabel(): string {
    return `${this.row}${this.number}`;
  }

  getType(): SeatType {
    return this.type;
  }
}

class User {
  constructor(private id: number, private name: string) {}

  getName(): string {
    return this.name;
  }

  getId(): number {
    return this.id;
  }
}

class Show {
  constructor(
    private id: number,
    private movie: Movie,
    private screen: Screen,
    private startTime: Date,
    private endTime: Date
  ) {}

  getMovie(): Movie {
    return this.movie;
  }

  getMovieDetails(): string {
    return this.movie.getDetails();
  }

  getScreen(): Screen {
    return this.screen;
  }

  getTiming(): string {
    return `${this.startTime.toLocaleTimeString()} - ${this.endTime.toLocaleTimeString()}`;
  }
}

class ShowSeat {
  private isBooked: boolean = false;
  private user: User | null = null;

  constructor(private id: number, private show: Show, private seat: Seat) {}

  book(user: User): boolean {
    if (this.isBooked) return false;

    this.isBooked = true;
    this.user = user;
    return true;
  }

  cancel(): void {
    this.isBooked = false;
    this.user = null;
  }

  getStatus(): string {
    return this.isBooked ? "BOOKED" : "AVAILABLE";
  }

  getSeat(): Seat {
    return this.seat;
  }

  getSeatLabel(): string {
    return this.seat.getSeatLabel();
  }

  getShow(): Show {
    return this.show;
  }

  getUser(): User | null {
    return this.user;
  }

  isSeatBooked(): boolean {
    return this.isBooked;
  }
}

class Booking {
  private status: BookingStatus;

  constructor(
    private id: number,
    private user: User,
    private show: Show,
    private seats: ShowSeat[],
    private totalAmount: number,
    private bookingTime: Date = new Date()
  ) {
    this.status = BookingStatus.CONFIRMED;
  }

  cancelBooking() {
    this.status = BookingStatus.CANCELLED;
    this.seats.forEach((seat) => seat.cancel());
  }

  getSummary(): void {
    console.log(`\nBooking ID: ${this.id}`);
    console.log(`User: ${this.user.getName()}`);
    console.log(`Movie: ${this.show.getMovieDetails()}`);
    console.log(`Show Time: ${this.show.getTiming()}`);
    console.log(
      `Seats: ${this.seats.map((seat) => seat.getSeatLabel()).join(", ")}`
    );
    console.log(`Total: ₹${this.totalAmount}`);
    console.log(`Booked At: ${this.bookingTime.toLocaleString()}`);
    console.log(`Status: ${this.status}\n`);
  }
}

function main() {
  const movie = new Movie(1, "Inception", 148);
  const theatre = new Theatre(1, "PVR Cinemas", "Delhi");
  const screen = new Screen(1, "Screen 1", theatre, 100);

  const seatA1 = new Seat(1, screen, "A", 1, SeatType.NORMAL);
  const seatA2 = new Seat(2, screen, "A", 2, SeatType.PREMIUM);

  const user = new User(1, "Himanshu");

  const show = new Show(
    1,
    movie,
    screen,
    new Date("2025-08-07T18:00:00"),
    new Date("2025-08-07T20:30:00")
  );

  const showSeat1 = new ShowSeat(1, show, seatA1);
  const showSeat2 = new ShowSeat(2, show, seatA2);

  // Booking flow
  const selectedSeats: ShowSeat[] = [];

  if (showSeat1.book(user)) selectedSeats.push(showSeat1);
  if (showSeat2.book(user)) selectedSeats.push(showSeat2);

  const total = selectedSeats.length * 250;

  const booking = new Booking(1, user, show, selectedSeats, total);

  booking.getSummary();
}

main();

export {};
