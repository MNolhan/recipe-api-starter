import { Controller, HttpCode, UseGuards } from '@nestjs/common';
import { Get, Query, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { Admin } from '../common/decorators/admin.decorator';
import { RecipeService } from './recipe.service';
import { QueryRecipeDto } from './dto/QueryRecipeDto';
import { CreateRecipeDto } from './dto/CreateRecipeDto';
import { UpdateRecipeDto } from './dto/UpdateRecipeDto';
import { ParseIntPipe } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('recipe')
@UseGuards(AdminGuard)
@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @HttpCode(200)
    @ApiOperation({ summary: 'Avoir toutes les recettes' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'title', required: false, type: String })
    @ApiQuery({ name: 'difficulty', required: false, type: String, enum: ['easy', 'medium', 'hard'] })
    @ApiQuery({ name: 'X-API-Key', required: true, type: String, description: 'X-API-Key' })
    @ApiResponse({ status: 200, description: 'Recettes récupérées avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Get()
    findAll(@Query() query: QueryRecipeDto) {
        return this.recipeService.findAll(query);
    }

    @HttpCode(200)
    @ApiOperation({ summary: 'Avoir une recette par ID' })
    @ApiParam({ name: 'id', required: true, type: Number })
    @ApiQuery({ name: 'X-API-Key', required: true, type: String, description: 'X-API-Key' })
    @ApiResponse({ status: 200, description: 'Recette récupérée avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 404, description: 'Recette non trouvée' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.recipeService.findOne(id);
    }

    @Admin()
    @HttpCode(201)
    @ApiOperation({ summary: 'Créer une nouvelle recette' })
    @ApiQuery({ name: 'X-API-Key', required: true, type: String, description: 'X-API-Key' })
    @ApiResponse({ status: 201, description: 'Recette créée avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 409, description: 'Conflit lors de la création de la recette' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Post()
    create(@Body() dto: CreateRecipeDto) {
        return this.recipeService.create(dto);
    }

    @Admin()
    @HttpCode(200)
    @ApiOperation({ summary: 'Mettre à jour une recette par ID' })
    @ApiParam({ name: 'id', required: true, type: Number })
    @ApiQuery({ name: 'X-API-Key', required: true, type: String, description: 'X-API-Key' })
    @ApiResponse({ status: 200, description: 'Recette mise à jour avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 404, description: 'Recette non trouvée' })
    @ApiResponse({ status: 409, description: 'Conflit lors de la mise à jour de la recette' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateRecipeDto) {
        return this.recipeService.update(id, body);
    }

    @Admin()
    @HttpCode(204)
    @ApiOperation({ summary: 'Supprimer une recette par ID' })
    @ApiParam({ name: 'id', required: true, type: Number })
    @ApiQuery({ name: 'X-API-Key', required: true, type: String, description: 'X-API-Key' })
    @ApiResponse({ status: 204, description: 'Recette supprimée avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Interdit' })
    @ApiResponse({ status: 404, description: 'Recette non trouvée' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.recipeService.remove(id);
    }
}
