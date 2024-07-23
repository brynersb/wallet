import { Controller, HttpStatus, Res, Get, Param, Query, Post, Body } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiQuery,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BusinessErrorResponseDto } from '../../dto/business-error.dto';
import { BusinessError } from '../../../../../libs/domain/common/types/business-error';
import TransactionErrorKey from '../../../../../libs/domain/wallet/utils/transaction-error-key';
import { AccountService } from '../../services/account-api.service';
import { AccountBalnceResponseDto } from '../../dto/account-balance-response.dto';
import { AccountSummaryResonseDto } from '../../dto/account-summary-response.dto';
import { CreateAccountRequestDto } from '../../dto/create-account-request.dto';
import { CreateAccountResponseDto } from '../../dto/create-account-response.dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':accountId/balance')
  @ApiOkResponse({ type: AccountBalnceResponseDto })
  @ApiInternalServerErrorResponse({ type: BusinessErrorResponseDto })
  @ApiBadRequestResponse({ type: BusinessErrorResponseDto })
  async getBalance(@Param('id') accountId: string, @Res() res: Response) {
    const result = await this.accountService.getBalance(accountId);

    if (result && !result.hasOwnProperty('errorKey')) {
      res.status(HttpStatus.OK).send(result);
    } else if (this.containsError(TransactionErrorKey.accountNotFound, result as BusinessError)) {
      res.status(HttpStatus.NOT_FOUND).send(result);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    }
  }

  @Get(':accountId/summary')
  @ApiOkResponse({ type: AccountSummaryResonseDto })
  @ApiInternalServerErrorResponse({ type: BusinessErrorResponseDto })
  @ApiBadRequestResponse({ type: BusinessErrorResponseDto })
  @ApiQuery({ name: 'startDate', type: String, required: true, description: 'inital date' })
  @ApiQuery({ name: 'endDate', type: String, required: true, description: 'final date' })
  async getSummary(
    @Param('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const result = await this.accountService.getSummary(accountId, startDate, endDate);

    if (result && !result.hasOwnProperty('errorKey')) {
      res.status(HttpStatus.OK).send(result);
    } else if (this.containsError(TransactionErrorKey.accountNotFound, result as BusinessError)) {
      res.status(HttpStatus.NOT_FOUND).send(result);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    }
  }

  private containsError(errorKey: string, businessError: BusinessError): boolean {
    return businessError.hasOwnProperty('errorKey') && businessError.errorKey === errorKey;
  }

  @Post('/create')
  @ApiOkResponse({ type: CreateAccountResponseDto })
  @ApiNotFoundResponse({ type: BusinessErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: BusinessErrorResponseDto })
  async createAccountRequest(@Body() createAccountRequest: CreateAccountRequestDto, @Res() res: Response) {
    const { name, email } = createAccountRequest;
    const result = await this.accountService.createAccount(name, email);

    if (result && !result.hasOwnProperty('errorKey')) {
      res.status(HttpStatus.CREATED).send(result);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    }
  }
}
