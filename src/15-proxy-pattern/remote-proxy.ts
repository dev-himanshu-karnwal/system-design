interface IDataService {
  fetchData(): string;
}

class RealDataService implements IDataService {
  constructor() {
    // Simulate remote setup or resource loading
    console.log("[RealDataService] Initialized (simulating remote setup)");
  }

  fetchData(): string {
    return "[RealDataService] Data from server";
  }
}

class DataServiceProxy implements IDataService {
  private realService: RealDataService;

  constructor() {
    this.realService = new RealDataService();
  }

  fetchData(): string {
    console.log("[DataServiceProxy] Connecting to remote service...");
    return this.realService.fetchData();
  }
}

// Usage
const dataService: IDataService = new DataServiceProxy();
console.log(dataService.fetchData());
