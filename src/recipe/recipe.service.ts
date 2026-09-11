import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { QueryRecipeDto } from './dto/QueryRecipeDto';
import Recipe from './recipe.interface';
import { CreateRecipeDto } from './dto/CreateRecipeDto';
import { UpdateRecipeDto } from './dto/UpdateRecipeDto';

@Injectable()
export class RecipeService {
    constructor(
        private readonly storage: StorageService,
    ) {}

    findAll(query: QueryRecipeDto): { data : Recipe[], total: number, page: number, limit: number } {
        let recipes = this.storage.read<Recipe[]>('recipes.json');

        if (query.title) {
            recipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(query.title!.toLowerCase()));
        }
        if (query.difficulty) {
            recipes = recipes.filter((recipe) => recipe.difficulty === query.difficulty);
        }
        
        const total = recipes.length;
        const page = query.page || 1;
        const limit = query.limit || 10;
        const data = recipes.slice((page - 1) * limit, page * limit);

        return { data, total, page, limit };
    }

    findOne(id: number): Recipe | NotFoundException {
        const recipes = this.storage.read<Recipe[]>('recipes.json');
        const recipe = recipes.find((recipe) => recipe.id === id);
        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }
        return recipe;
    }

    create(dto : CreateRecipeDto): Recipe {
        const recipes = this.storage.read<Recipe[]>('recipes.json');
        
        if (recipes.some((recipe) => recipe.title.toLowerCase() === dto.title?.toLowerCase())) {
            throw new ConflictException(`Recipe with title "${dto.title}" already exists`);
        }

        const NextId = recipes.length > 0 ? Math.max(...recipes.map((recipe) => recipe.id)) + 1 : 1;
        const newRecipe: Recipe = {
            id: NextId,
            ...dto,
            createdAt: new Date().toISOString(),
        };

        this.storage.write('recipes.json', [...recipes, newRecipe]);
        return newRecipe;
    }

    update(id: number, dto: UpdateRecipeDto): Recipe {
        const recipes = this.storage.read<Recipe[]>('recipes.json');
        const index = recipes.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        if (dto.title) {
            const conflict = recipes.find(
                (recipe) => recipe.title.toLowerCase() === dto.title!.toLowerCase() && recipe.id !== id,
            );
            if (conflict) {
                throw new ConflictException(`A recipe titled "${dto.title}" already exists`);
            }
        }
    
        const updated: Recipe = { ...recipes[index], ...dto };
        recipes[index] = updated;
        this.storage.write('recipes.json', recipes);
        return updated;
    }

    remove(id: number): void {
        const recipes = this.storage.read<Recipe[]>('recipes.json');
        const index = recipes.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }
        recipes.splice(index, 1);
        this.storage.write('recipes.json', recipes);
    }
}
