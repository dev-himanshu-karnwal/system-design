// -------------------- Enums -------------------- //
enum Gender {
  MALE,
  FEMALE,
  NON_BINARY,
  OTHER,
}

enum SwipeAction {
  LEFT,
  RIGHT,
}

enum MatcherType {
  BASIC,
  INTERESTS_BASED,
  LOCATION_BASED,
}

// -------------------- Interfaces -------------------- //
interface NotificationObserver {
  update(message: string): void;
}

interface LocationStrategy {
  findNearbyUsers(
    location: Location,
    maxDistance: number,
    allUsers: User[]
  ): User[];
}

interface Matcher {
  calculateMatchScore(user1: User, user2: User): number;
}

// -------------------- Classes -------------------- //
class UserNotificationObserver implements NotificationObserver {
  private userId: string;

  constructor(id: string) {
    this.userId = id;
  }

  update(message: string): void {
    console.log(`Notification for user ${this.userId}: ${message}`);
  }
}

class NotificationService {
  private observers: Map<string, NotificationObserver> = new Map();
  private static instance: NotificationService | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  registerObserver(userId: string, observer: NotificationObserver): void {
    this.observers.set(userId, observer);
  }

  removeObserver(userId: string): void {
    this.observers.delete(userId);
  }

  notifyUser(userId: string, message: string): void {
    const observer = this.observers.get(userId);
    if (observer) {
      observer.update(message);
    }
  }

  notifyAll(message: string): void {
    this.observers.forEach((observer) => {
      observer.update(message);
    });
  }
}

class Location {
  private latitude: number;
  private longitude: number;

  constructor(lat: number = 0.0, lon: number = 0.0) {
    this.latitude = lat;
    this.longitude = lon;
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  setLatitude(lat: number): void {
    this.latitude = lat;
  }

  setLongitude(lon: number): void {
    this.longitude = lon;
  }

  distanceInKm(other: Location): number {
    const earthRadiusKm = 6371.0;
    const dLat = ((other.latitude - this.latitude) * Math.PI) / 180.0;
    const dLon = ((other.longitude - this.longitude) * Math.PI) / 180.0;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180.0) *
        Math.cos((other.latitude * Math.PI) / 180.0) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
}

class Interest {
  private name: string;
  private category: string;

  constructor(n: string = "", c: string = "") {
    this.name = n;
    this.category = c;
  }

  getName(): string {
    return this.name;
  }

  getCategory(): string {
    return this.category;
  }
}

class Preference {
  private interestedIn: Gender[] = [];
  private minAge: number = 18;
  private maxAge: number = 100;
  private maxDistance: number = 100.0; // in kilometers
  private interests: string[] = [];

  addGenderPreference(gender: Gender): void {
    this.interestedIn.push(gender);
  }

  removeGenderPreference(gender: Gender): void {
    this.interestedIn = this.interestedIn.filter((g) => g !== gender);
  }

  setAgeRange(min: number, max: number): void {
    this.minAge = min;
    this.maxAge = max;
  }

  setMaxDistance(distance: number): void {
    this.maxDistance = distance;
  }

  addInterest(interest: string): void {
    this.interests.push(interest);
  }

  removeInterest(interest: string): void {
    this.interests = this.interests.filter((i) => i !== interest);
  }

  isInterestedInGender(gender: Gender): boolean {
    return this.interestedIn.includes(gender);
  }

  isAgeInRange(age: number): boolean {
    return age >= this.minAge && age <= this.maxAge;
  }

  isDistanceAcceptable(distance: number): boolean {
    return distance <= this.maxDistance;
  }

  getInterests(): string[] {
    return this.interests;
  }

  getInterestedGenders(): Gender[] {
    return this.interestedIn;
  }

  getMinAge(): number {
    return this.minAge;
  }

  getMaxAge(): number {
    return this.maxAge;
  }

  getMaxDistance(): number {
    return this.maxDistance;
  }
}

class Message {
  private senderId: string;
  private content: string;
  private timestamp: Date;

  constructor(sender: string, msg: string) {
    this.senderId = sender;
    this.content = msg;
    this.timestamp = new Date();
  }

  getSenderId(): string {
    return this.senderId;
  }

  getContent(): string {
    return this.content;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getFormattedTime(): string {
    return this.timestamp.toLocaleString();
  }
}

class ChatRoom {
  private id: string;
  private participantIds: string[];
  private messages: Message[];

  constructor(roomId: string, user1Id: string, user2Id: string) {
    this.id = roomId;
    this.participantIds = [user1Id, user2Id];
    this.messages = [];
  }

  getId(): string {
    return this.id;
  }

  addMessage(senderId: string, content: string): void {
    const msg = new Message(senderId, content);
    this.messages.push(msg);
  }

  hasParticipant(userId: string): boolean {
    return this.participantIds.includes(userId);
  }

  getMessages(): Message[] {
    return this.messages;
  }

  getParticipants(): string[] {
    return this.participantIds;
  }

  displayChat(): void {
    console.log(`===== Chat Room: ${this.id} =====`);
    this.messages.forEach((msg) => {
      console.log(
        `[${msg.getFormattedTime()}] ${msg.getSenderId()}: ${msg.getContent()}`
      );
    });
    console.log("=========================");
  }
}

class UserProfile {
  private name: string = "";
  private age: number = 0;
  private gender: Gender = Gender.OTHER;
  private bio: string = "";
  private photos: string[] = [];
  private interests: Interest[] = [];
  private location: Location = new Location();

  setName(n: string): void {
    this.name = n;
  }

  setAge(a: number): void {
    this.age = a;
  }

  setGender(g: Gender): void {
    this.gender = g;
  }

  setBio(b: string): void {
    this.bio = b;
  }

  addPhoto(photoUrl: string): void {
    this.photos.push(photoUrl);
  }

  removePhoto(photoUrl: string): void {
    this.photos = this.photos.filter((photo) => photo !== photoUrl);
  }

  addInterest(name: string, category: string): void {
    const interest = new Interest(name, category);
    this.interests.push(interest);
  }

  removeInterest(name: string): void {
    this.interests = this.interests.filter(
      (interest) => interest.getName() !== name
    );
  }

  setLocation(loc: Location): void {
    this.location = loc;
  }

  getName(): string {
    return this.name;
  }

  getAge(): number {
    return this.age;
  }

  getGender(): Gender {
    return this.gender;
  }

  getBio(): string {
    return this.bio;
  }

  getPhotos(): string[] {
    return this.photos;
  }

  getInterests(): Interest[] {
    return this.interests;
  }

  getLocation(): Location {
    return this.location;
  }

  display(): void {
    console.log("===== Profile =====");
    console.log(`Name: ${this.name}`);
    console.log(`Age: ${this.age}`);
    console.log(`Gender: ${Gender[this.gender]}`);
    console.log(`Bio: ${this.bio}`);

    console.log("Photos: " + this.photos.join(", "));

    const interestStrings = this.interests.map(
      (i) => `${i.getName()} (${i.getCategory()})`
    );
    console.log("Interests: " + interestStrings.join(", "));

    console.log(
      `Location: ${this.location.getLatitude()}, ${this.location.getLongitude()}`
    );
    console.log("===================");
  }
}

class User {
  private id: string;
  private profile: UserProfile;
  private preference: Preference;
  private swipeHistory: Map<string, SwipeAction> = new Map();
  private notificationObserver: NotificationObserver;

  constructor(userId: string) {
    this.id = userId;
    this.profile = new UserProfile();
    this.preference = new Preference();
    this.notificationObserver = new UserNotificationObserver(userId);
    NotificationService.getInstance().registerObserver(
      userId,
      this.notificationObserver
    );
  }

  getId(): string {
    return this.id;
  }

  getProfile(): UserProfile {
    return this.profile;
  }

  getPreference(): Preference {
    return this.preference;
  }

  swipe(otherUserId: string, action: SwipeAction): void {
    this.swipeHistory.set(otherUserId, action);
  }

  hasLiked(otherUserId: string): boolean {
    const action = this.swipeHistory.get(otherUserId);
    return action === SwipeAction.RIGHT;
  }

  hasDisliked(otherUserId: string): boolean {
    const action = this.swipeHistory.get(otherUserId);
    return action === SwipeAction.LEFT;
  }

  hasInteractedWith(otherUserId: string): boolean {
    return this.swipeHistory.has(otherUserId);
  }

  displayProfile(): void {
    this.profile.display();
  }
}

class BasicLocationStrategy implements LocationStrategy {
  findNearbyUsers(
    location: Location,
    maxDistance: number,
    allUsers: User[]
  ): User[] {
    const nearbyUsers: User[] = [];
    for (const user of allUsers) {
      const distance = location.distanceInKm(user.getProfile().getLocation());
      if (distance <= maxDistance) {
        nearbyUsers.push(user);
      }
    }
    return nearbyUsers;
  }
}

class LocationService {
  private strategy: LocationStrategy;
  private static instance: LocationService | null = null;

  private constructor() {
    this.strategy = new BasicLocationStrategy();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  setStrategy(newStrategy: LocationStrategy): void {
    this.strategy = newStrategy;
  }

  findNearbyUsers(
    location: Location,
    maxDistance: number,
    allUsers: User[]
  ): User[] {
    return this.strategy.findNearbyUsers(location, maxDistance, allUsers);
  }
}

class BasicMatcher implements Matcher {
  calculateMatchScore(user1: User, user2: User): number {
    const user1LikesUser2Gender = user1
      .getPreference()
      .isInterestedInGender(user2.getProfile().getGender());
    const user2LikesUser1Gender = user2
      .getPreference()
      .isInterestedInGender(user1.getProfile().getGender());

    if (!user1LikesUser2Gender || !user2LikesUser1Gender) {
      return 0.0;
    }

    const user1LikesUser2Age = user1
      .getPreference()
      .isAgeInRange(user2.getProfile().getAge());
    const user2LikesUser1Age = user2
      .getPreference()
      .isAgeInRange(user1.getProfile().getAge());

    if (!user1LikesUser2Age || !user2LikesUser1Age) {
      return 0.0;
    }

    const distance = user1
      .getProfile()
      .getLocation()
      .distanceInKm(user2.getProfile().getLocation());
    const user1LikesUser2Distance = user1
      .getPreference()
      .isDistanceAcceptable(distance);
    const user2LikesUser1Distance = user2
      .getPreference()
      .isDistanceAcceptable(distance);

    if (!user1LikesUser2Distance || !user2LikesUser1Distance) {
      return 0.0;
    }

    return 0.5;
  }
}

class InterestsBasedMatcher implements Matcher {
  calculateMatchScore(user1: User, user2: User): number {
    const basicMatcher = new BasicMatcher();
    const baseScore = basicMatcher.calculateMatchScore(user1, user2);

    if (baseScore === 0.0) {
      return 0.0;
    }

    const user1InterestNames = user1
      .getProfile()
      .getInterests()
      .map((interest) => interest.getName());

    let sharedInterests = 0;
    for (const interest of user2.getProfile().getInterests()) {
      if (user1InterestNames.includes(interest.getName())) {
        sharedInterests++;
      }
    }

    const maxInterests = Math.max(
      user1.getProfile().getInterests().length,
      user2.getProfile().getInterests().length
    );
    const interestScore =
      maxInterests > 0 ? 0.5 * (sharedInterests / maxInterests) : 0.0;

    return baseScore + interestScore;
  }
}

class LocationBasedMatcher implements Matcher {
  calculateMatchScore(user1: User, user2: User): number {
    const interestsMatcher = new InterestsBasedMatcher();
    const baseScore = interestsMatcher.calculateMatchScore(user1, user2);

    if (baseScore === 0.0) {
      return 0.0;
    }

    const distance = user1
      .getProfile()
      .getLocation()
      .distanceInKm(user2.getProfile().getLocation());
    const maxDistance = Math.min(
      user1.getPreference().getMaxDistance(),
      user2.getPreference().getMaxDistance()
    );

    const proximityScore =
      maxDistance > 0 ? 0.2 * (1.0 - distance / maxDistance) : 0.0;

    return baseScore + proximityScore;
  }
}

class MatcherFactory {
  static createMatcher(type: MatcherType): Matcher {
    switch (type) {
      case MatcherType.BASIC:
        return new BasicMatcher();
      case MatcherType.INTERESTS_BASED:
        return new InterestsBasedMatcher();
      case MatcherType.LOCATION_BASED:
        return new LocationBasedMatcher();
      default:
        return new BasicMatcher();
    }
  }
}

class DatingApp {
  private users: User[] = [];
  private chatRooms: ChatRoom[] = [];
  private matcher: Matcher;
  private static instance: DatingApp | null = null;

  private constructor() {
    this.matcher = MatcherFactory.createMatcher(MatcherType.LOCATION_BASED);
  }

  public static getInstance(): DatingApp {
    if (!DatingApp.instance) {
      DatingApp.instance = new DatingApp();
    }
    return DatingApp.instance;
  }

  setMatcher(type: MatcherType): void {
    this.matcher = MatcherFactory.createMatcher(type);
  }

  createUser(userId: string): User {
    const user = new User(userId);
    this.users.push(user);
    return user;
  }

  getUserById(userId: string): User | null {
    return this.users.find((user) => user.getId() === userId) || null;
  }

  findNearbyUsers(userId: string, maxDistance: number = 5.0): User[] {
    const user = this.getUserById(userId);
    if (!user) {
      return [];
    }

    const nearbyUsers = LocationService.getInstance().findNearbyUsers(
      user.getProfile().getLocation(),
      maxDistance,
      this.users
    );

    const filteredUsers = nearbyUsers.filter((otherUser) => {
      if (otherUser === user) return false;
      if (user.hasInteractedWith(otherUser.getId())) return false;

      const score = this.matcher.calculateMatchScore(user, otherUser);
      return score > 0;
    });

    return filteredUsers;
  }

  swipe(userId: string, targetUserId: string, action: SwipeAction): boolean {
    const user = this.getUserById(userId);
    const targetUser = this.getUserById(targetUserId);

    if (!user || !targetUser) {
      console.log("User not found.");
      return false;
    }

    user.swipe(targetUserId, action);

    if (action === SwipeAction.RIGHT && targetUser.hasLiked(userId)) {
      const chatRoomId = `${userId}_${targetUserId}`;
      const chatRoom = new ChatRoom(chatRoomId, userId, targetUserId);
      this.chatRooms.push(chatRoom);

      NotificationService.getInstance().notifyUser(
        userId,
        `You have a new match with ${targetUser.getProfile().getName()}!`
      );
      NotificationService.getInstance().notifyUser(
        targetUserId,
        `You have a new match with ${user.getProfile().getName()}!`
      );
      return true;
    }
    return false;
  }

  getChatRoom(user1Id: string, user2Id: string): ChatRoom | null {
    return (
      this.chatRooms.find(
        (chatRoom) =>
          chatRoom.hasParticipant(user1Id) && chatRoom.hasParticipant(user2Id)
      ) || null
    );
  }

  sendMessage(senderId: string, receiverId: string, content: string): void {
    const chatRoom = this.getChatRoom(senderId, receiverId);
    if (!chatRoom) {
      console.log("No chat room found between these users.");
      return;
    }

    chatRoom.addMessage(senderId, content);

    const sender = this.getUserById(senderId);
    if (sender) {
      NotificationService.getInstance().notifyUser(
        receiverId,
        `New message from ${sender.getProfile().getName()}`
      );
    }
  }

  displayUser(userId: string): void {
    const user = this.getUserById(userId);
    if (!user) {
      console.log("User not found.");
      return;
    }

    user.displayProfile();
  }

  displayChatRoom(user1Id: string, user2Id: string): void {
    const chatRoom = this.getChatRoom(user1Id, user2Id);
    if (!chatRoom) {
      console.log("No chat room found between these users.");
      return;
    }

    chatRoom.displayChat();
  }
}

// -------------------- Main Execution -------------------- //
function main() {
  const app = DatingApp.getInstance();

  // Create users
  const user1 = app.createUser("user1");
  const user2 = app.createUser("user2");

  // Set user1 profile
  const profile1 = user1.getProfile();
  profile1.setName("Rohan");
  profile1.setAge(28);
  profile1.setGender(Gender.MALE);
  profile1.setBio("I am a software developer");
  profile1.addPhoto("rohan_photo1.jpg");
  profile1.addInterest("Coding", "Programming");
  profile1.addInterest("Travel", "Lifestyle");
  profile1.addInterest("Music", "Entertainment");

  // Setup user1 preferences
  const pref1 = user1.getPreference();
  pref1.addGenderPreference(Gender.FEMALE);
  pref1.setAgeRange(25, 30);
  pref1.setMaxDistance(10.0);
  pref1.addInterest("Coding");
  pref1.addInterest("Travel");

  // Setup user2 profile
  const profile2 = user2.getProfile();
  profile2.setName("Neha");
  profile2.setAge(27);
  profile2.setGender(Gender.FEMALE);
  profile2.setBio("Art teacher who loves painting and traveling.");
  profile2.addPhoto("neha_photo1.jpg");
  profile2.addInterest("Painting", "Art");
  profile2.addInterest("Travel", "Lifestyle");
  profile2.addInterest("Music", "Entertainment");

  // Setup user2 preferences
  const pref2 = user2.getPreference();
  pref2.addGenderPreference(Gender.MALE);
  pref2.setAgeRange(27, 30);
  pref2.setMaxDistance(15.0);
  pref2.addInterest("Coding");
  pref2.addInterest("Movies");

  // Set location for user1
  const location1 = new Location();
  location1.setLatitude(1.01);
  location1.setLongitude(1.02);
  profile1.setLocation(location1);

  // Set location for user2 (Close to user1, within 5km)
  const location2 = new Location();
  location2.setLatitude(1.03);
  location2.setLongitude(1.04);
  profile2.setLocation(location2);

  // Display user profiles
  console.log("---- User Profiles ----");
  app.displayUser("user1");
  app.displayUser("user2");

  // Find nearby users for user1 (within 5km)
  console.log("\n---- Nearby Users for user1 (within 5km) ----");
  const nearbyUsers = app.findNearbyUsers("user1", 5.0);
  console.log(`Found ${nearbyUsers.length} nearby users`);
  nearbyUsers.forEach((user) => {
    console.log(`- ${user.getProfile().getName()} (${user.getId()})`);
  });

  // User1 swipes right on User2
  console.log("\n---- Swipe Actions ----");
  console.log("User1 swipes right on User2");
  app.swipe("user1", "user2", SwipeAction.RIGHT);

  // User2 swipes right on User1 (creating a match)
  console.log("User2 swipes right on User1");
  app.swipe("user2", "user1", SwipeAction.RIGHT);

  // Send messages in the chat room
  console.log("\n---- Chat Room ----");
  app.sendMessage("user1", "user2", "Hi Neha, Kaise ho?");
  app.sendMessage("user2", "user1", "Hi Rohan, Ma bdiya tum btao");

  // Display the chat room
  app.displayChatRoom("user1", "user2");
}

main();

export {};
