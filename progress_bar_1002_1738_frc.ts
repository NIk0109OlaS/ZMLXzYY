// 代码生成时间: 2025-10-02 17:38:48
import { delay } from "https://deno.land/<EMAIL_ADDRESS>.0/async/delay.ts";

interface ProgressBarOptions {
  total: number;
  width?: number;
  completeSymbol?: string;
  incompleteSymbol?: string;
  animationSpeed?: number;
}

class ProgressBar {
  private total: number;
  private width: number;
  private completeSymbol: string;
  private incompleteSymbol: string;
  private animationSpeed: number;
  private currentProgress: number;

  constructor(options: ProgressBarOptions) {
    this.total = options.total;
    this.width = options.width || 50; // default width
    this.completeSymbol = options.completeSymbol || "=";
    this.incompleteSymbol = options.incompleteSymbol || "-";
    this.animationSpeed = options.animationSpeed || 100; // default speed in milliseconds
    this.currentProgress = 0;
  }

  public start(): void {
    this.updateProgress(0);
    this.animateProgressBar();
  }

  private animateProgressBar(): void {
    for (let i = 0; i < this.total; i++) {
      this.updateProgress(i + 1);
      await delay(this.animationSpeed); // delay for animation effect
    }
  }

  private updateProgress(progress: number): void {
    this.currentProgress = progress;
    const completeLength = Math.floor((progress / this.total) * this.width);
    const completeString = this.completeSymbol.repeat(completeLength);
    const incompleteLength = this.width - completeLength;
    const incompleteString = this.incompleteSymbol.repeat(incompleteLength);
    console.log(`[${completeString}${incompleteString}]\r`); // carriage return to overwrite previous line
  }

  public async stop(): Promise<void> {
    console.log(`Progress: [${this.completeSymbol.repeat(this.width)}] 100%`); // finish progress bar
  }
}

// Example usage
const options = {
  total: 100,
  width: 40,
  completeSymbol: "#",
  incompleteSymbol: "-",
  animationSpeed: 50,
};

const progress = new ProgressBar(options);
progress.start();
// Optionally, you can stop the progress bar from another part of your code
// progress.stop();