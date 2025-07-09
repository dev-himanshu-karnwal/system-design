// Memento interface - Represents the saved state
interface IMemento {
  getText(): string;
  getTimestamp(): Date;
}

// Originator - The object whose state we want to save/restore
class TextEditor {
  private text: string = "";

  constructor(initialText: string = "") {
    this.text = initialText;
  }

  // Add text to the editor
  type(text: string): void {
    this.text += text;
    console.log(`Current text: ${this.text}`);
  }

  // Delete last character
  backspace(): void {
    this.text = this.text.slice(0, -1);
    console.log(`Current text: ${this.text}`);
  }

  // Create a memento (snapshot) of the current state
  save(): IMemento {
    console.log(`Saving state with text: ${this.text}`);
    return new TextMemento(this.text);
  }

  // Restore state from a memento
  restore(memento: IMemento): void {
    this.text = memento.getText();
    console.log(`Restored text from ${memento.getTimestamp()}: ${this.text}`);
  }

  getCurrentText(): string {
    return this.text;
  }
}

// Concrete Memento - Implements the Memento interface
class TextMemento implements IMemento {
  private readonly text: string;
  private readonly timestamp: Date;

  constructor(text: string) {
    this.text = text;
    this.timestamp = new Date();
  }

  getText(): string {
    return this.text;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

// Caretaker - Manages the mementos (history)
class HistoryManager {
  private mementos: IMemento[] = [];
  private currentIndex: number = -1;

  // Save a new state to history
  saveState(editor: TextEditor): void {
    // If we're not at the end of history, truncate future states
    if (this.currentIndex < this.mementos.length - 1) {
      this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    }

    const memento = editor.save();
    this.mementos.push(memento);
    this.currentIndex = this.mementos.length - 1;
    console.log(`State saved. History length: ${this.mementos.length}`);
  }

  // Undo - restore previous state
  undo(editor: TextEditor): void {
    if (this.currentIndex <= 0) {
      console.log("Nothing to undo!");
      return;
    }

    this.currentIndex--;
    const memento = this.mementos[this.currentIndex];
    editor.restore(memento);
  }

  // Redo - restore next state
  redo(editor: TextEditor): void {
    if (this.currentIndex >= this.mementos.length - 1) {
      console.log("Nothing to redo!");
      return;
    }

    this.currentIndex++;
    const memento = this.mementos[this.currentIndex];
    editor.restore(memento);
  }

  // Show history
  showHistory(): void {
    console.log("\n=== Editing History ===");
    this.mementos.forEach((memento, index) => {
      const time = memento.getTimestamp().toLocaleTimeString();
      const textPreview =
        memento.getText().slice(0, 20) +
        (memento.getText().length > 20 ? "..." : "");
      const current = index === this.currentIndex ? "(current)" : "";
      console.log(`${index + 1}. [${time}] ${textPreview} ${current}`);
    });
  }
}

// Client code - Using the text editor with undo/redo functionality
function main() {
  const editor = new TextEditor();
  const history = new HistoryManager();

  // Initial state
  editor.type("Hello");
  history.saveState(editor);

  // Make some changes
  editor.type(" World");
  history.saveState(editor);

  editor.type("! How are you?");
  history.saveState(editor);

  // Show history
  history.showHistory();

  // Undo last change
  console.log("\nUndoing last change:");
  history.undo(editor);
  console.log(`Current text: ${editor.getCurrentText()}`);

  // Undo again
  console.log("\nUndoing again:");
  history.undo(editor);
  console.log(`Current text: ${editor.getCurrentText()}`);

  // Redo
  console.log("\nRedoing:");
  history.redo(editor);
  console.log(`Current text: ${editor.getCurrentText()}`);

  // Make a new change (should truncate future history)
  console.log("\nMaking new change after undo:");
  editor.type(" Welcome!");
  history.saveState(editor);
  history.showHistory();

  // Try to redo (should be nothing)
  console.log("\nAttempting to redo:");
  history.redo(editor);
}

main();

export {};
