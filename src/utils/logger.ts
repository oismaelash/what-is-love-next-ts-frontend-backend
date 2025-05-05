import { isDev } from './constants';

class Logger {
  private static instance: Logger;
  private enabled: boolean;

  private constructor() {
    this.enabled = isDev;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public log(...args: any[]): void {
    if (this.enabled) {
      console.log(...args);
    }
  }

  public error(...args: any[]): void {
    if (this.enabled) {
      console.error(...args);
    }
  }

  public warn(...args: any[]): void {
    if (this.enabled) {
      console.warn(...args);
    }
  }

  public info(...args: any[]): void {
    if (this.enabled) {
      console.info(...args);
    }
  }

  public debug(...args: any[]): void {
    if (this.enabled) {
      console.debug(...args);
    }
  }
}

export const logger = Logger.getInstance(); 