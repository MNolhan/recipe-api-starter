import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import type { Request as ExpressRequest } from 'express';
import { AuthService, User } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';

type AuthenticatedRequest = ExpressRequest & {
    user: User;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @HttpCode(201)
    @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
    @ApiQuery({ name: 'body', required: true, type: RegisterDto })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body.email);
    }

    @Get('me')
    @HttpCode(200)
    @ApiOperation({ summary: 'Récupérer les informations de l\'utilisateur connecté' })
    @ApiHeader({ name: 'X-API-Key', required: true, description: 'X-API-Key' })
    @ApiResponse({ status: 200, description: 'Informations de l\'utilisateur récupérées avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    getMe(@Request() req: AuthenticatedRequest) {
        return this.authService.getMe(req.user.apiKey);
    }

    @ApiOperation({ summary: 'Régénérer la clé API de l\'utilisateur connecté' })
    @ApiHeader({ name: 'X-API-Key', required: true, description: 'X-API-Key' })
    @ApiResponse({ status: 200, description: 'Clé API régénérée avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Post('regenerate-key')
    @HttpCode(200)
    regenerateKey(@Request() req: AuthenticatedRequest) {
        return this.authService.regenerateKey(req.user.apiKey);
    }

    @Delete('account')
    @HttpCode(204)
    @ApiOperation({ summary: 'Supprimer le compte de l\'utilisateur connecté' })
    @ApiHeader({ name: 'X-API-Key', required: true, description: 'X-API-Key' })
    @ApiResponse({ status: 204, description: 'Compte supprimé avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    deleteAccount(@Request() req: AuthenticatedRequest) {
        this.authService.deleteAccount(req.user.apiKey);
    }
}