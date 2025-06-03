// 1. Target interface expected by the client
interface IReports {
  // Accepts raw data and returns JSON string
  getJsonData(data: string): string;
}

// 2. Adaptee: provides XML data from a raw input
class XmlDataProvider {
  // Expects data in "name:id" format (e.g., "Alice:42")
  getXmlData(data: string): string {
    const [name, id] = data.split(":");
    return `<user><name>${name}</name><id>${id}</id></user>`;
  }
}

// 3. Adapter: converts XML → JSON and implements IReports
class XmlDataProviderAdapter implements IReports {
  private xmlProvider: XmlDataProvider;

  constructor(provider: XmlDataProvider) {
    this.xmlProvider = provider;
  }

  getJsonData(data: string): string {
    const xml = this.xmlProvider.getXmlData(data);

    const nameStart = xml.indexOf("<name>") + 6;
    const nameEnd = xml.indexOf("</name>");
    const name = xml.substring(nameStart, nameEnd);

    const idStart = xml.indexOf("<id>") + 4;
    const idEnd = xml.indexOf("</id>");
    const id = xml.substring(idStart, idEnd);

    return JSON.stringify({ name, id: Number(id) });
  }
}

// 4. Client code only uses IReports
class Client {
  getReport(report: IReports, rawData: string): void {
    console.log("Processed JSON:", report.getJsonData(rawData));
  }
}

// 5. Main Execution (like main function)
const xmlProvider = new XmlDataProvider();
const adapter = new XmlDataProviderAdapter(xmlProvider);

const rawData = "Alice:42";

const client = new Client();
client.getReport(adapter, rawData);
// → Processed JSON: {"name":"Alice","id":42}

export {};
