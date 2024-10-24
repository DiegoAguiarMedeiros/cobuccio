import { Controller, Post, Body, Param, Get, Put, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateDepositWithdrawalTransactionDto } from './dto/create-deposit-withdrawal-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @ApiResponse({ status: 400, description: 'Transaction not found' })
    @Post('transfer')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createTransaction(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.createTransaction(req, createTransactionDto);
    }

    @ApiResponse({ status: 400, description: 'Transaction not found' })
    @Get('wallet')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getTransactionsByWallet(@Request() req) {
        return this.transactionService.getTransactionsByWallet(req);
    }

    @Put(':transactionId/reverse')
    @ApiOperation({ summary: 'Reverses a transaction' })
    @ApiResponse({ status: 200, description: 'The transaction has been reversed successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid transaction or cannot reverse.' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async reverseTransaction(@Request() req, @Param('transactionId') transactionId: number) {
        return this.transactionService.reverseTransaction(req, transactionId);
    }

    @ApiResponse({ status: 400, description: 'Wallet not found' })
    @Post('deposit')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createDeposit(@Request() req, @Body() createDepositWithdrawalTransactionDto: CreateDepositWithdrawalTransactionDto) {
        return this.transactionService.createDeposit(req, createDepositWithdrawalTransactionDto);
    }
    @ApiResponse({ status: 400, description: 'Wallet not found' })
    @Post('withdrawal')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createWithdrawal(@Request() req, @Body() createDepositWithdrawalTransactionDto: CreateDepositWithdrawalTransactionDto) {
        const user = req.user;
        return this.transactionService.createWithdrawal(req, createDepositWithdrawalTransactionDto);
    }

}
