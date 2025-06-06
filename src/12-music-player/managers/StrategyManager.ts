import { PlayStrategy } from "../strategies/PlayStrategy";
import { SequentialPlayStrategy } from "../strategies/SequentialPlayStrategy";
import { RandomPlayStrategy } from "../strategies/RandomPlayStrategy";
import { CustomQueueStrategy } from "../strategies/CustomQueueStrategy";
import { PlayStrategyType } from "../enums/PlayStrategyType";

export class StrategyManager {
  private static instance: StrategyManager | null = null;

  private sequentialStrategy: SequentialPlayStrategy;
  private randomStrategy: RandomPlayStrategy;
  private customQueueStrategy: CustomQueueStrategy;

  private constructor() {
    this.sequentialStrategy = new SequentialPlayStrategy();
    this.randomStrategy = new RandomPlayStrategy();
    this.customQueueStrategy = new CustomQueueStrategy();
  }

  public static getInstance(): StrategyManager {
    if (!StrategyManager.instance) {
      StrategyManager.instance = new StrategyManager();
    }
    return StrategyManager.instance;
  }

  public getStrategy(type: PlayStrategyType): PlayStrategy {
    switch (type) {
      case PlayStrategyType.SEQUENTIAL:
        return this.sequentialStrategy;
      case PlayStrategyType.RANDOM:
        return this.randomStrategy;
      case PlayStrategyType.CUSTOM_QUEUE:
        return this.customQueueStrategy;
      default:
        throw new Error(`Unknown strategy type: ${type}`);
    }
  }
}
