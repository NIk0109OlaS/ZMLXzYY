// 代码生成时间: 2025-09-24 14:16:19
 * This scheduler can handle multiple tasks at different intervals.
 */

import { setTimeout } from 'https://deno.land/std@0.132.0/async/delay.ts';

interface ScheduledTask {
  task: () => Promise<void>;
  interval: number;
}

class TaskScheduler {
  private tasks: ScheduledTask[] = [];

  constructor() {}

  /**
   * Add a new scheduled task to the scheduler.
   * @param task The task to be executed.
   * @param interval The interval in milliseconds.
   */
  addTask(task: () => Promise<void>, interval: number): void {
    const scheduledTask: ScheduledTask = {
      task,
      interval,
    };
    this.tasks.push(scheduledTask);
    this.scheduleTask(scheduledTask);
  }

  /**
   * Schedules the task to run at the specified interval.
   * @param task The scheduled task.
   */
  private async scheduleTask(task: ScheduledTask): Promise<void> {
    try {
      while (true) {
        await task.task();
        await setTimeout(task.interval);
      }
    } catch (error) {
      console.error(`Error scheduling task: ${error}`);
    }
  }

  /**
   * Start all scheduled tasks.
   */
  start(): void {
    this.tasks.forEach((task) => this.scheduleTask(task));
  }
}

// Example usage:
// Define a task function that logs a message every second.
const taskFunction = async (): Promise<void> => {
  console.log('Task executed at:', new Date().toISOString());
};

// Create a new TaskScheduler instance.
const scheduler = new TaskScheduler();

// Add the task to the scheduler with a 1-second interval.
scheduler.addTask(taskFunction, 1000);

// Start the scheduler.
scheduler.start();