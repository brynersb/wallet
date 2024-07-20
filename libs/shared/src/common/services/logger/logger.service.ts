import { Injectable, Logger, Scope } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../../domain/common/services/logger/logger.service.interface';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService implements LoggerServiceInterface {
  private readonly logger: Logger = new Logger(LoggerService.name);
  private _logPrefix: string;

  setLogPrefix(logPrefix: string): void {
    this._logPrefix = logPrefix;
  }

  log(message: string): void {
    this.logger.log(this.createFormattedMessage(message));
  }

  warn(message: string): void {
    this.logger.warn(this.createFormattedMessage(message));
  }

  error(message: string): void {
    this.logger.error(this.createFormattedMessage(message));
  }

  private createFormattedMessage(message: string): string {
    if (this._logPrefix) {
      return `[${this._logPrefix}] ${message}`;
    }
    return message;
  }
}
