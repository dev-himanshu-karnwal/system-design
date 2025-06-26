interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

interface Iterable<T> {
  getIterator(): Iterator<T>;
}

// Linked List
class LinkedList implements Iterable<number> {
  data: number;
  next: LinkedList | null;

  constructor(value: number) {
    this.data = value;
    this.next = null;
  }

  getIterator(): Iterator<number> {
    return new LinkedListIterator(this);
  }
}

// Binary Tree
class BinaryTree implements Iterable<number> {
  data: number;
  left: BinaryTree | null;
  right: BinaryTree | null;

  constructor(value: number) {
    this.data = value;
    this.left = null;
    this.right = null;
  }

  getIterator(): Iterator<number> {
    return new BinaryTreeInorderIterator(this);
  }
}

// Song and Playlist
class Song {
  title: string;
  artist: string;

  constructor(title: string, artist: string) {
    this.title = title;
    this.artist = artist;
  }
}

class Playlist implements Iterable<Song> {
  songs: Song[] = [];

  addSong(song: Song): void {
    this.songs.push(song);
  }

  getIterator(): Iterator<Song> {
    return new PlaylistIterator(this.songs);
  }
}

// LinkedList Iterator
class LinkedListIterator implements Iterator<number> {
  private current: LinkedList | null;

  constructor(head: LinkedList) {
    this.current = head;
  }

  hasNext(): boolean {
    return this.current !== null;
  }

  next(): number {
    const val = this.current!.data;
    this.current = this.current!.next;
    return val;
  }
}

// BinaryTree Inorder Iterator
class BinaryTreeInorderIterator implements Iterator<number> {
  private stack: BinaryTree[] = [];

  constructor(root: BinaryTree | null) {
    this.pushLefts(root);
  }

  private pushLefts(node: BinaryTree | null): void {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }

  next(): number {
    const node = this.stack.pop()!;
    const val = node.data;
    if (node.right) {
      this.pushLefts(node.right);
    }
    return val;
  }
}

// Playlist Iterator
class PlaylistIterator implements Iterator<Song> {
  private index: number = 0;
  private vec: Song[];

  constructor(vec: Song[]) {
    this.vec = vec;
  }

  hasNext(): boolean {
    return this.index < this.vec.length;
  }

  next(): Song {
    return this.vec[this.index++];
  }
}

// ----------------------------
// Main Execution

function main() {
  // Linked List: 1 → 2 → 3
  const list = new LinkedList(1);
  list.next = new LinkedList(2);
  list.next.next = new LinkedList(3);

  let iterator1 = list.getIterator();
  console.log("LinkedList contents:");
  while (iterator1.hasNext()) {
    console.log(iterator1.next());
  }

  // Binary Tree:
  //    2
  //   / \
  //  1   3
  const root = new BinaryTree(2);
  root.left = new BinaryTree(1);
  root.right = new BinaryTree(3);

  let iterator2 = root.getIterator();
  console.log("BinaryTree inorder:");
  while (iterator2.hasNext()) {
    console.log(iterator2.next());
  }

  // Playlist
  const playlist = new Playlist();
  playlist.addSong(new Song("52 Bars", "Karan Aujla"));
  playlist.addSong(new Song("Narayan", "Jubin Nautiyal"));

  let iterator3 = playlist.getIterator();
  console.log("Playlist songs:");
  while (iterator3.hasNext()) {
    const song = iterator3.next();
    console.log(`  ${song.title} by ${song.artist}`);
  }
}

main();

export {};
