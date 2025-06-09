// Interface for Document Reader
interface IDocumentReader {
  unlockPDF(filePath: string, password: string): void;
}

// Concrete Class: Reads the PDF (simulated)
class RealDocumentReader implements IDocumentReader {
  unlockPDF(filePath: string, password: string): void {
    console.log(`[RealDocumentReader] Unlocking PDF at: ${filePath}`);
    console.log(
      `[RealDocumentReader] PDF unlocked successfully with password: ${password}`
    );
    console.log(`[RealDocumentReader] Displaying PDF content...`);
  }
}

// User class with membership status
class User {
  name: string;
  premiumMembership: boolean;

  constructor(name: string, isPremium: boolean) {
    this.name = name;
    this.premiumMembership = isPremium;
  }
}

// Proxy Class: Controls access to RealDocumentReader
class DocumentProxy implements IDocumentReader {
  private realReader: RealDocumentReader;
  private user: User;

  constructor(user: User) {
    this.realReader = new RealDocumentReader();
    this.user = user;
  }

  unlockPDF(filePath: string, password: string): void {
    if (!this.user.premiumMembership) {
      console.log(
        "[DocumentProxy] Access denied. Only premium members can unlock PDFs."
      );
      return;
    }

    // Forwarding the request to the real reader
    this.realReader.unlockPDF(filePath, password);
  }
}

// Client code
const user1 = new User("Rohan", false); // Non-Premium User
const user2 = new User("Rashmi", true); // Premium User

console.log("== Rohan (Non-Premium) tries to unlock PDF ==");
let docReader: IDocumentReader = new DocumentProxy(user1);
docReader.unlockPDF("protected_document.pdf", "secret123");

console.log("\n== Rashmi (Premium) unlocks PDF ==");
docReader = new DocumentProxy(user2);
docReader.unlockPDF("protected_document.pdf", "secret123");
