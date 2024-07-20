import { Body, Controller, HttpStatus, Post, Res, Get, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { TransactionsResponseDto } from '../../dto/transaction-response.dto';
import { BusinessErrorResponseDto } from '../../dto/business-error.dto';
import { TransactionRequestDto } from '../../dto/transaction-request.dto';
import { BusinessError } from '../../../../../libs/domain/common/types/business-error';
import TransactionErrorKey from '../../../../../libs/domain/wallet/utils/transaction-error-key';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsApiController {
  constructor(private readonly transactionsApiService: TransactionsApiService) {}

  @Post()
  @ApiOkResponse({ type: TransactionsResponseDto })
  @ApiNotFoundResponse({ type: BusinessErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: BusinessErrorResponseDto })
  async transactionRequest(@Body() transactionRequest: TransactionRequestDto, @Res() res: Response) {
    const result = await this.transactionsApiService.createTransaction(transactionRequest);

    if (result && !result.hasOwnProperty('errorKey')) {
      res.status(HttpStatus.CREATED).send(result);
    } else if (this.containsError(TransactionErrorKey.accountNotFound, result as BusinessError)) {
      res.status(HttpStatus.NOT_FOUND).send(result);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    }
  }

  @Get('/:id')
  @ApiOkResponse({ type: TransactionsResponseDto })
  @ApiInternalServerErrorResponse({ type: BusinessErrorResponseDto })
  @ApiBadRequestResponse({ type: BusinessErrorResponseDto })
  async getTransactionStatus(@Param('id') id: string, @Res() res: Response) {
    const result = await this.transactionsApiService.getTransaction(id);

    if (result && !result.hasOwnProperty('errorKey')) {
      res.status(HttpStatus.OK).send(result);
    } else if (this.containsError(TransactionErrorKey.trasactionNotFound, result as BusinessError)) {
      res.status(HttpStatus.NOT_FOUND).send(result);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    }
  }

  private containsError(errorKey: string, businessError: BusinessError): boolean {
    return businessError.hasOwnProperty('errorKey') && businessError.errorKey === errorKey;
  }
}
