interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTimeMinutes: number;
  servings: number;
  createdAt: string; // généré côté serveur, jamais fourni par le client
}

export default Recipe;