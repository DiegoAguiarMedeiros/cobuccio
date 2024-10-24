import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post()
    @ApiExcludeEndpoint()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createWallet() {
        return this.walletService.createWallet();
    }

    @ApiResponse({ status: 400, description: 'Carteira não encontrada' })
    @Get('balance')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getWalletBalance(@Request() req) {
        return this.walletService.getWalletBalance(req);
    }
}
