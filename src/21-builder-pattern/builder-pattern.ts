class HttpRequest {
  private url: string | null = null;
  private method: string | null = null;
  private headers: Map<string, string>;
  private queryParams: Map<string, string>;
  private body: string | null = null;
  private timeout: number | null = null; // in seconds

  // Private constructor - can only be accessed by the Builder
  private constructor() {
    this.headers = new Map();
    this.queryParams = new Map();
  }

  // Method to execute the HTTP request
  execute(): void {
    console.log(`Executing ${this.method} request to ${this.url}`);

    if (this.queryParams.size > 0) {
      console.log("Query Parameters:");
      this.queryParams.forEach((value, key) => {
        console.log(`  ${key}=${value}`);
      });
    }

    console.log("Headers:");
    this.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    if (this.body) {
      console.log(`Body: ${this.body}`);
    }

    console.log(`Timeout: ${this.timeout} seconds`);
    console.log("Request executed successfully!");
  }

  // Builder class as a static nested class
  static Builder = class {
    private req: HttpRequest;

    constructor() {
      this.req = new HttpRequest();
    }

    // Method chaining
    withUrl(u: string): this {
      this.req.url = u;
      return this;
    }

    withMethod(method: string): this {
      this.req.method = method;
      return this;
    }

    withHeader(key: string, value: string): this {
      this.req.headers.set(key, value);
      return this;
    }

    withQueryParam(key: string, value: string): this {
      this.req.queryParams.set(key, value);
      return this;
    }

    withBody(body: string): this {
      this.req.body = body;
      return this;
    }

    withTimeout(timeout: number): this {
      this.req.timeout = timeout;
      return this;
    }

    // Build method to create the immutable HttpRequest object
    build(): HttpRequest {
      // Validation logic
      if (!this.req.url) {
        throw new Error("URL cannot be empty");
      }
      if (!this.req.method) {
        throw new Error("Method cannot be empty");
      }
      return this.req;
    }
  };
}

function main() {
  try {
    // Using Builder Pattern (nested class)
    const request = new HttpRequest.Builder()
      .withUrl("https://api.example.com")
      .withMethod("POST")
      .withHeader("Content-Type", "application/json")
      .withHeader("Accept", "application/json")
      .withQueryParam("key", "12345")
      .withBody('{"name": "Aditya"}')
      .withTimeout(60)
      .build();

    request.execute(); // Guaranteed to be in a consistent state
  } catch (error) {
    console.error(`Error building request: ${error}`);
  }
}

main();

export {};
