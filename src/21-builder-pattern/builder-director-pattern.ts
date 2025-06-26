class HttpRequest {
  private url: string | null = null;
  private method: string | null = null;
  private headers: Map<string, string>;
  private queryParams: Map<string, string>;
  private body: string | null = null;
  private timeout: number | null = null; // in seconds

  private constructor() {
    this.headers = new Map();
    this.queryParams = new Map();
  }

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

    if (this.timeout) {
      console.log(`Timeout: ${this.timeout} seconds`);
    }
    console.log("Request executed successfully!");
  }

  static Builder = class {
    private req: HttpRequest;

    constructor() {
      this.req = new HttpRequest();
    }

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

    build(): HttpRequest {
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

class HttpRequestDirector {
  static createGetRequest(url: string): HttpRequest {
    return new HttpRequest.Builder().withUrl(url).withMethod("GET").build();
  }

  static createJsonPostRequest(url: string, jsonBody: string): HttpRequest {
    return new HttpRequest.Builder()
      .withUrl(url)
      .withMethod("POST")
      .withHeader("Content-Type", "application/json")
      .withHeader("Accept", "application/json")
      .withBody(jsonBody)
      .build();
  }
}

function main() {
  try {
    // Normal Request from Builder Directly
    const normalRequest = new HttpRequest.Builder()
      .withUrl("https://api.example.com")
      .withMethod("POST")
      .withHeader("Content-Type", "application/json")
      .withHeader("Accept", "application/json")
      .withQueryParam("key", "12345")
      .withBody('{"name": "Aditya"}')
      .withTimeout(60)
      .build();

    normalRequest.execute();

    console.log("\n----------------------------\n");

    const getRequest = HttpRequestDirector.createGetRequest(
      "https://api.example.com/users"
    );
    getRequest.execute();

    console.log("\n----------------------------\n");

    const postRequest = HttpRequestDirector.createJsonPostRequest(
      "https://api.example.com/users",
      '{"name": "Aditya", "email": "aditya@example.com"}'
    );
    postRequest.execute();
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main();

export {};
