// ───────────────────────────────────────────────────────────
// 1. Base class defining the template method
// ───────────────────────────────────────────────────────────

abstract class ModelTrainer {
  // The template method — defines the training pipeline
  public trainPipeline(dataPath: string): void {
    this.loadData(dataPath);
    this.preprocessData();
    this.trainModel();
    this.evaluateModel();
    this.saveModel();
  }

  protected loadData(path: string): void {
    console.log(`[Common] Loading dataset from ${path}`);
    // e.g., fetch data, read file, etc.
  }

  protected preprocessData(): void {
    console.log("[Common] Splitting into train/test and normalizing");
  }

  protected abstract trainModel(): void;
  protected abstract evaluateModel(): void;

  protected saveModel(): void {
    console.log("[Common] Saving model to disk as default format");
  }
}

// ───────────────────────────────────────────────────────────
// 2. Concrete subclass: Neural Network
// ───────────────────────────────────────────────────────────

class NeuralNetworkTrainer extends ModelTrainer {
  protected trainModel(): void {
    console.log("[NeuralNet] Training Neural Network for 100 epochs");
    // Simulate training loop
  }

  protected evaluateModel(): void {
    console.log("[NeuralNet] Evaluating accuracy and loss on validation set");
  }

  protected saveModel(): void {
    console.log("[NeuralNet] Serializing network weights to .h5 file");
  }
}

// ───────────────────────────────────────────────────────────
// 3. Concrete subclass: Decision Tree
// ───────────────────────────────────────────────────────────

class DecisionTreeTrainer extends ModelTrainer {
  protected trainModel(): void {
    console.log("[DecisionTree] Building decision tree with max_depth=5");
  }

  protected evaluateModel(): void {
    console.log(
      "[DecisionTree] Computing classification report (precision/recall)"
    );
  }

  // Uses default preprocessData() and saveModel()
}

// ───────────────────────────────────────────────────────────
// 4. Usage
// ───────────────────────────────────────────────────────────

function main(): void {
  console.log("=== Neural Network Training ===");
  const nnTrainer = new NeuralNetworkTrainer();
  nnTrainer.trainPipeline("data/images/");

  console.log("\n=== Decision Tree Training ===");
  const dtTrainer = new DecisionTreeTrainer();
  dtTrainer.trainPipeline("data/iris.csv");
}

main();
