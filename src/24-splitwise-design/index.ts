// Split types
enum SplitType {
  EQUAL = "EQUAL",
  EXACT = "EXACT",
  PERCENTAGE = "PERCENTAGE",
}

// Split interface
interface ISplit {
  userId: string;
  amount: number;
}

// Observer interface
interface IObserver {
  update(message: string): void;
}

// Strategy Pattern - Split strategies interface
interface ISplitStrategy {
  calculateSplit(
    totalAmount: number,
    userIds: string[],
    values?: number[]
  ): ISplit[];
}

// Concrete strategies
class EqualSplit implements ISplitStrategy {
  calculateSplit(totalAmount: number, userIds: string[]): ISplit[] {
    const splits: ISplit[] = [];
    const amountPerUser = totalAmount / userIds.length;

    for (const userId of userIds) {
      splits.push({ userId, amount: amountPerUser });
    }
    return splits;
  }
}

class ExactSplit implements ISplitStrategy {
  calculateSplit(
    totalAmount: number,
    userIds: string[],
    values: number[] = []
  ): ISplit[] {
    const splits: ISplit[] = [];

    for (let i = 0; i < userIds.length; i++) {
      splits.push({ userId: userIds[i], amount: values[i] });
    }
    return splits;
  }
}

class PercentageSplit implements ISplitStrategy {
  calculateSplit(
    totalAmount: number,
    userIds: string[],
    values: number[] = []
  ): ISplit[] {
    const splits: ISplit[] = [];

    for (let i = 0; i < userIds.length; i++) {
      const amount = (totalAmount * values[i]) / 100.0;
      splits.push({ userId: userIds[i], amount });
    }
    return splits;
  }
}

// Factory for split strategies
class SplitFactory {
  static getSplitStrategy(type: SplitType): ISplitStrategy {
    switch (type) {
      case SplitType.EQUAL:
        return new EqualSplit();
      case SplitType.EXACT:
        return new ExactSplit();
      case SplitType.PERCENTAGE:
        return new PercentageSplit();
      default:
        return new EqualSplit();
    }
  }
}

// User class
class User implements IObserver {
  private static nextUserId = 0;
  userId: string;
  name: string;
  email: string;
  balances: Map<string, number>; // userId -> amount (positive = they owe you, negative = you owe them)

  constructor(name: string, email: string) {
    this.userId = "user" + ++User.nextUserId;
    this.name = name;
    this.email = email;
    this.balances = new Map<string, number>();
  }

  update(message: string): void {
    console.log(`[NOTIFICATION to ${this.name}]: ${message}`);
  }

  updateBalance(otherUserId: string, amount: number): void {
    const currentBalance = this.balances.get(otherUserId) || 0;
    const newBalance = currentBalance + amount;

    // Remove if balance becomes zero
    if (Math.abs(newBalance) < 0.01) {
      this.balances.delete(otherUserId);
    } else {
      this.balances.set(otherUserId, newBalance);
    }
  }

  getTotalOwed(): number {
    let total = 0;
    this.balances.forEach((amount, userId) => {
      if (amount < 0) {
        total += Math.abs(amount);
      }
    });
    return total;
  }

  getTotalOwing(): number {
    let total = 0;
    this.balances.forEach((amount, userId) => {
      if (amount > 0) {
        total += amount;
      }
    });
    return total;
  }
}

// Expense Model class
class Expense {
  private static nextExpenseId = 0;
  expenseId: string;
  description: string;
  totalAmount: number;
  paidByUserId: string;
  splits: ISplit[];
  groupId: string;

  constructor(
    desc: string,
    amount: number,
    paidBy: string,
    splits: ISplit[],
    group = ""
  ) {
    this.expenseId = "expense" + ++Expense.nextExpenseId;
    this.description = desc;
    this.totalAmount = amount;
    this.paidByUserId = paidBy;
    this.splits = splits;
    this.groupId = group;
  }
}

class DebtSimplifier {
  static simplifyDebts(
    groupBalances: Map<string, Map<string, number>>
  ): Map<string, Map<string, number>> {
    // Calculate net amount for each person
    const netAmounts = new Map<string, number>();

    // Initialize all users with 0
    groupBalances.forEach((_, userId) => {
      netAmounts.set(userId, 0);
    });

    // Calculate net amounts
    groupBalances.forEach((userBalances, creditorId) => {
      userBalances.forEach((amount, debtorId) => {
        // Only process positive amounts to avoid double counting
        if (amount > 0) {
          netAmounts.set(
            creditorId,
            (netAmounts.get(creditorId) || 0) + amount
          ); // creditor receives
          netAmounts.set(debtorId, (netAmounts.get(debtorId) || 0) - amount); // debtor pays
        }
      });
    });

    // Divide users into creditors and debtors
    const creditors: { userId: string; amount: number }[] = []; // those who should receive money
    const debtors: { userId: string; amount: number }[] = []; // those who should pay money

    netAmounts.forEach((amount, userId) => {
      if (amount > 0.01) {
        // creditor
        creditors.push({ userId, amount });
      } else if (amount < -0.01) {
        // debtor
        debtors.push({ userId, amount: Math.abs(amount) }); // store positive amount
      }
    });

    // Sort for better optimization (largest amounts first)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Create new simplified balance map
    const simplifiedBalances = new Map<string, Map<string, number>>();

    // Initialize empty maps for all users
    groupBalances.forEach((_, userId) => {
      simplifiedBalances.set(userId, new Map<string, number>());
    });

    // Use greedy algorithm to minimize transactions
    let i = 0,
      j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];

      // Find the minimum amount to settle
      const settleAmount = Math.min(creditor.amount, debtor.amount);

      // Update simplified balances
      // debtorId owes creditorId the settleAmount
      simplifiedBalances.get(creditor.userId)?.set(debtor.userId, settleAmount);
      simplifiedBalances
        .get(debtor.userId)
        ?.set(creditor.userId, -settleAmount);

      // Update remaining amounts
      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      // Move to next creditor or debtor if current one is settled
      if (creditor.amount < 0.01) {
        i++;
      }
      if (debtor.amount < 0.01) {
        j++;
      }
    }

    return simplifiedBalances;
  }
}

// Group class
class Group {
  private static nextGroupId = 0;
  groupId: string;
  name: string;
  members: User[] = []; //observers
  groupExpenses: Map<string, Expense> = new Map(); // Group's own expense book
  groupBalances: Map<string, Map<string, number>> = new Map(); // memberId -> {otherMemberId -> balance}

  constructor(name: string) {
    this.groupId = "group" + ++Group.nextGroupId;
    this.name = name;
  }

  private getUserById(userId: string): User | undefined {
    return this.members.find((member) => member.userId === userId);
  }

  addMember(user: User): void {
    this.members.push(user);
    // Initialize balance map for new member
    this.groupBalances.set(user.userId, new Map<string, number>());
    console.log(`${user.name} added to group ${this.name}`);
  }

  removeMember(userId: string): boolean {
    // Check if user can be removed or not
    if (!this.canUserLeaveGroup(userId)) {
      console.log(
        "\nUser not allowed to leave group without clearing expenses"
      );
      return false;
    }

    // Remove from observers
    const userIndex = this.members.findIndex(
      (member) => member.userId === userId
    );
    if (userIndex !== -1) {
      this.members.splice(userIndex, 1);
    }

    // Remove from group balances
    this.groupBalances.delete(userId);

    // Remove this user from other members' balance maps
    this.groupBalances.forEach((balanceMap) => {
      balanceMap.delete(userId);
    });

    return true;
  }

  notifyMembers(message: string): void {
    this.members.forEach((member) => {
      member.update(message);
    });
  }

  isMember(userId: string): boolean {
    return this.groupBalances.has(userId);
  }

  // Update balance within group
  updateGroupBalance(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): void {
    const fromUserBalances =
      this.groupBalances.get(fromUserId) || new Map<string, number>();
    const toUserBalances =
      this.groupBalances.get(toUserId) || new Map<string, number>();

    const fromBalance = fromUserBalances.get(toUserId) || 0;
    const toBalance = toUserBalances.get(fromUserId) || 0;

    fromUserBalances.set(toUserId, fromBalance + amount);
    toUserBalances.set(fromUserId, toBalance - amount);

    // Remove if balance becomes zero
    if (Math.abs(fromBalance + amount) < 0.01) {
      fromUserBalances.delete(toUserId);
    }
    if (Math.abs(toBalance - amount) < 0.01) {
      toUserBalances.delete(fromUserId);
    }

    this.groupBalances.set(fromUserId, fromUserBalances);
    this.groupBalances.set(toUserId, toUserBalances);
  }

  // Check if user can leave group.
  canUserLeaveGroup(userId: string): boolean {
    if (!this.isMember(userId)) {
      throw new Error("user is not a part of this group");
    }

    // Check if user has any outstanding balance with other group members
    const userBalanceSheet = this.groupBalances.get(userId);
    if (!userBalanceSheet) return true;

    for (const balance of userBalanceSheet.values()) {
      if (Math.abs(balance) > 0.01) {
        return false; // Has outstanding balance
      }
    }
    return true;
  }

  // Get user's balance within this group
  getUserGroupBalances(userId: string): Map<string, number> {
    if (!this.isMember(userId)) {
      throw new Error("user is not a part of this group");
    }
    return this.groupBalances.get(userId) || new Map<string, number>();
  }

  // Add expense to this group
  addExpense(
    description: string,
    amount: number,
    paidByUserId: string,
    involvedUsers: string[],
    splitType: SplitType,
    splitValues: number[] = []
  ): boolean {
    if (!this.isMember(paidByUserId)) {
      throw new Error("user is not a part of this group");
    }

    // Validate that all involved users are group members
    for (const userId of involvedUsers) {
      if (!this.isMember(userId)) {
        throw new Error("involvedUsers are not a part of this group");
      }
    }

    // Generate splits using strategy pattern
    const strategy = SplitFactory.getSplitStrategy(splitType);
    const splits = strategy.calculateSplit(amount, involvedUsers, splitValues);

    // Create expense in group's own expense book
    const expense = new Expense(
      description,
      amount,
      paidByUserId,
      splits,
      this.groupId
    );
    this.groupExpenses.set(expense.expenseId, expense);

    // Update group balances
    for (const split of splits) {
      if (split.userId !== paidByUserId) {
        // Person who paid gets positive balance, person who owes gets negative
        this.updateGroupBalance(paidByUserId, split.userId, split.amount);
      }
    }

    console.log("\n=========== Sending Notifications ====================");
    const paidByName = this.getUserById(paidByUserId)?.name || paidByUserId;
    this.notifyMembers(`New expense added: ${description} (Rs ${amount})`);

    // Printing console message-------
    console.log("\n=========== Expense Message ====================");
    console.log(
      `Expense added to ${this.name}: ${description} (Rs ${amount}) paid by ${paidByName} and involved people are:`
    );

    if (splitValues.length > 0) {
      for (let i = 0; i < splitValues.length; i++) {
        const userName =
          this.getUserById(involvedUsers[i])?.name || involvedUsers[i];
        console.log(`${userName} : ${splitValues[i]}`);
      }
    } else {
      involvedUsers.forEach((userId) => {
        const userName = this.getUserById(userId)?.name || userId;
        console.log(userName + ", ");
      });
      console.log("\nWill be Paid Equally");
    }
    //-----------------------------------

    return true;
  }

  settlePayment(fromUserId: string, toUserId: string, amount: number): boolean {
    // Validate that both users are group members
    if (!this.isMember(fromUserId) || !this.isMember(toUserId)) {
      console.log("user is not a part of this group");
      return false;
    }

    // Update group balances
    this.updateGroupBalance(fromUserId, toUserId, amount);

    // Get user names for display
    const fromName = this.getUserById(fromUserId)?.name || fromUserId;
    const toName = this.getUserById(toUserId)?.name || toUserId;

    // Notify group members
    this.notifyMembers(`Settlement: ${fromName} paid ${toName} Rs ${amount}`);

    console.log(
      `Settlement in ${this.name}: ${fromName} settled Rs ${amount} with ${toName}`
    );

    return true;
  }

  showGroupBalances(): void {
    console.log(`\n=== Group Balances for ${this.name} ===`);

    this.groupBalances.forEach((userBalances, memberId) => {
      const memberName = this.getUserById(memberId)?.name || memberId;
      console.log(`${memberName}'s balances in group:`);

      if (userBalances.size === 0) {
        console.log("  No outstanding balances");
      } else {
        userBalances.forEach((balance, otherMemberId) => {
          const otherName =
            this.getUserById(otherMemberId)?.name || otherMemberId;

          if (balance > 0) {
            console.log(`  ${otherName} owes: Rs ${balance.toFixed(2)}`);
          } else {
            console.log(
              `  Owes ${otherName}: Rs ${Math.abs(balance).toFixed(2)}`
            );
          }
        });
      }
    });
  }

  simplifyGroupDebts(): void {
    const simplifiedBalances = DebtSimplifier.simplifyDebts(this.groupBalances);
    this.groupBalances = simplifiedBalances;

    console.log(`\nDebts have been simplified for group: ${this.name}`);
  }
}

// Main Splitwise class (Singleton)
class Splitwise {
  private static instance: Splitwise;
  private users: Map<string, User> = new Map();
  private groups: Map<string, Group> = new Map();
  private expenses: Map<string, Expense> = new Map();

  private constructor() {}

  static getInstance(): Splitwise {
    if (!Splitwise.instance) {
      Splitwise.instance = new Splitwise();
    }
    return Splitwise.instance;
  }

  // User management
  createUser(name: string, email: string): User {
    const user = new User(name, email);
    this.users.set(user.userId, user);
    console.log(`User created: ${name} (ID: ${user.userId})`);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  // Group management
  createGroup(name: string): Group {
    const group = new Group(name);
    this.groups.set(group.groupId, group);
    console.log(`Group created: ${name} (ID: ${group.groupId})`);
    return group;
  }

  getGroup(groupId: string): Group | undefined {
    return this.groups.get(groupId);
  }

  addUserToGroup(userId: string, groupId: string): void {
    const user = this.getUser(userId);
    const group = this.getGroup(groupId);

    if (user && group) {
      group.addMember(user);
    }
  }

  removeUserFromGroup(userId: string, groupId: string): boolean {
    const group = this.getGroup(groupId);

    if (!group) {
      console.log("Group not found!");
      return false;
    }

    const user = this.getUser(userId);
    if (!user) {
      console.log("User not found!");
      return false;
    }

    const userRemoved = group.removeMember(userId);

    if (userRemoved) {
      console.log(`${user.name} successfully left ${group.name}`);
    }
    return userRemoved;
  }

  // Expense management - delegate to group
  addExpenseToGroup(
    groupId: string,
    description: string,
    amount: number,
    paidByUserId: string,
    involvedUsers: string[],
    splitType: SplitType,
    splitValues: number[] = []
  ): void {
    const group = this.getGroup(groupId);
    if (!group) {
      console.log("Group not found!");
      return;
    }

    group.addExpense(
      description,
      amount,
      paidByUserId,
      involvedUsers,
      splitType,
      splitValues
    );
  }

  // Settlement - delegate to group
  settlePaymentInGroup(
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amount: number
  ): void {
    const group = this.getGroup(groupId);
    if (!group) {
      console.log("Group not found!");
      return;
    }

    group.settlePayment(fromUserId, toUserId, amount);
  }

  // Settlement
  settleIndividualPayment(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): void {
    const fromUser = this.getUser(fromUserId);
    const toUser = this.getUser(toUserId);

    if (fromUser && toUser) {
      fromUser.updateBalance(toUserId, amount);
      toUser.updateBalance(fromUserId, -amount);

      console.log(`${fromUser.name} settled Rs${amount} with ${toUser.name}`);
    }
  }

  addIndividualExpense(
    description: string,
    amount: number,
    paidByUserId: string,
    toUserId: string,
    splitType: SplitType,
    splitValues: number[] = []
  ): void {
    const strategy = SplitFactory.getSplitStrategy(splitType);
    const splits = strategy.calculateSplit(
      amount,
      [paidByUserId, toUserId],
      splitValues
    );

    const expense = new Expense(description, amount, paidByUserId, splits);
    this.expenses.set(expense.expenseId, expense);

    const paidByUser = this.getUser(paidByUserId);
    const toUser = this.getUser(toUserId);

    if (paidByUser && toUser) {
      paidByUser.updateBalance(toUserId, amount);
      toUser.updateBalance(paidByUserId, -amount);

      console.log(
        `Individual expense added: ${description} (Rs ${amount}) paid by ${paidByUser.name} for ${toUser.name}`
      );
    }
  }

  // Display Method
  showUserBalance(userId: string): void {
    const user = this.getUser(userId);
    if (!user) return;

    console.log(`\n=========== Balance for ${user.name} ====================`);
    console.log(`Total you owe: Rs ${user.getTotalOwed().toFixed(2)}`);
    console.log(`Total others owe you: Rs ${user.getTotalOwing().toFixed(2)}`);

    console.log("Detailed balances:");
    user.balances.forEach((amount, otherUserId) => {
      const otherUser = this.getUser(otherUserId);
      if (otherUser) {
        if (amount > 0) {
          console.log(`  ${otherUser.name} owes you: Rs${amount.toFixed(2)}`);
        } else {
          console.log(
            `  You owe ${otherUser.name}: Rs${Math.abs(amount).toFixed(2)}`
          );
        }
      }
    });
  }

  showGroupBalances(groupId: string): void {
    const group = this.getGroup(groupId);
    if (!group) return;

    group.showGroupBalances();
  }

  simplifyGroupDebts(groupId: string): void {
    const group = this.getGroup(groupId);
    if (!group) return;

    group.simplifyGroupDebts();
  }
}

// Main function
function main() {
  const manager = Splitwise.getInstance();

  console.log("\n=========== Creating Users ====================");
  const user1 = manager.createUser("Aditya", "aditya@gmail.com");
  const user2 = manager.createUser("Rohit", "rohit@gmail.com");
  const user3 = manager.createUser("Manish", "manish@gmail.com");
  const user4 = manager.createUser("Saurav", "saurav@gmail.com");

  console.log(
    "\n=========== Creating Group and Adding Members ===================="
  );
  const hostelGroup = manager.createGroup("Hostel Expenses");
  manager.addUserToGroup(user1.userId, hostelGroup.groupId);
  manager.addUserToGroup(user2.userId, hostelGroup.groupId);
  manager.addUserToGroup(user3.userId, hostelGroup.groupId);
  manager.addUserToGroup(user4.userId, hostelGroup.groupId);

  console.log("\n=========== Adding Expenses in group ====================");
  const groupMembers = [user1.userId, user2.userId, user3.userId, user4.userId];
  manager.addExpenseToGroup(
    hostelGroup.groupId,
    "Lunch",
    800.0,
    user1.userId,
    groupMembers,
    SplitType.EQUAL
  );

  const dinnerMembers = [user1.userId, user3.userId, user4.userId];
  const dinnerAmounts = [200.0, 300.0, 200.0];
  manager.addExpenseToGroup(
    hostelGroup.groupId,
    "Dinner",
    700.0,
    user3.userId,
    dinnerMembers,
    SplitType.EXACT,
    dinnerAmounts
  );

  console.log(
    "\n=========== printing Group-Specific Balances ===================="
  );
  manager.showGroupBalances(hostelGroup.groupId);

  console.log("\n=========== Debt Simplification ====================");
  manager.simplifyGroupDebts(hostelGroup.groupId);

  console.log(
    "\n=========== printing Group-Specific Balances ===================="
  );
  manager.showGroupBalances(hostelGroup.groupId);

  console.log("\n=========== Adding Individual Expense ====================");
  manager.addIndividualExpense(
    "Coffee",
    40.0,
    user2.userId,
    user4.userId,
    SplitType.EQUAL
  );

  console.log("\n=========== printing User Balances ====================");
  manager.showUserBalance(user1.userId);
  manager.showUserBalance(user2.userId);
  manager.showUserBalance(user3.userId);
  manager.showUserBalance(user4.userId);

  console.log("\n==========Attempting to remove Rohit from group==========");
  manager.removeUserFromGroup(user2.userId, hostelGroup.groupId);

  console.log("\n======== Making Settlement to Clear Rohit's Debt ==========");
  manager.settlePaymentInGroup(
    hostelGroup.groupId,
    user2.userId,
    user3.userId,
    200.0
  );

  console.log("\n======== Attempting to Remove Rohit Again ==========");
  manager.removeUserFromGroup(user2.userId, hostelGroup.groupId);

  console.log("\n=========== Updated Group Balances ====================");
  manager.showGroupBalances(hostelGroup.groupId);
}

// Run the program
main();

export {};
