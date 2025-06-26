// Step builder interfaces
interface UrlStep {
  withUrl(url: string): MethodStep;
}

interface MethodStep {
  withMethod(method: string): HeaderStep;
}

interface HeaderStep {
  withHeader(key: string, value: string): OptionalStep;
}

interface OptionalStep {
  withBody(body: string): OptionalStep;
  withTimeout(timeout: number): OptionalStep;
  build(): HttpRequest;
}

class HttpRequest {
  private url: string = "";
  private method: string = "";
  private headers: Map<string, string> = new Map();
  private queryParams: Map<string, string> = new Map();
  private body: string = "";
  private timeout: number = 0; // in seconds

  private constructor() {}

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

  // Concrete builder implementation
  static Builder = class
    implements UrlStep, MethodStep, HeaderStep, OptionalStep
  {
    private readonly request: HttpRequest;

    constructor() {
      this.request = new HttpRequest();
    }

    withUrl(url: string): MethodStep {
      this.request.url = url;
      return this;
    }

    withMethod(method: string): HeaderStep {
      this.request.method = method;
      return this;
    }

    withHeader(key: string, value: string): OptionalStep {
      this.request.headers.set(key, value);
      return this;
    }

    withBody(body: string): OptionalStep {
      this.request.body = body;
      return this;
    }

    withTimeout(timeout: number): OptionalStep {
      this.request.timeout = timeout;
      return this;
    }

    build(): HttpRequest {
      if (!this.request.url) {
        throw new Error("URL cannot be empty");
      }
      if (!this.request.method) {
        throw new Error("Method cannot be empty");
      }
      return this.request;
    }

    static getBuilder(): UrlStep {
      return new HttpRequest.Builder();
    }
  };
}

// Usage example
function main() {
  try {
    const request: HttpRequest = HttpRequest.Builder.getBuilder()
      .withUrl("https://api.example.com/products")
      .withMethod("POST")
      .withHeader("Content-Type", "application/json")
      .withBody('{"product": "Laptop", "price": 49999}')
      .withTimeout(45)
      .build();

    request.execute();
  } catch (error) {
    console.error(`Error building request: ${error}`);
  }
}

main();

export {};
