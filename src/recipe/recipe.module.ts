import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService, StorageService],
})
export class RecipeModule {}
