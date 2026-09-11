import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './CreateRecipeDto';

/**
 * Tous les champs de CreateMangaDto deviennent optionnels.
 * Les validateurs sont conservés lorsqu'un champ est fourni.
 */
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
