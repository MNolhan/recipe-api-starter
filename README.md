# RecipeAPI

API REST pour gérer un catalogue de recettes de cuisine, faite avec NestJS. Toutes les routes sont protégées par clé API, et les actions d'écriture (création, modification, suppression) demandent en plus un rôle admin.

## Installation

```bash
npm install
npm run dev
```

L'API répond sur `http://localhost:3000/api`. La doc Swagger est sur `http://localhost:3000/api/docs`.

## Authentification

Chaque requête doit envoyer un header `X-API-Key`, Sans Key on a accès à rien dutout.

- Header absent → `401 Unauthorized`
- Clé invalide → `403 Forbidden`
- Clé valide → accès aux routes de lecture (`GET`)

Les routes `POST`, `PATCH` et `DELETE` demandent en plus un rôle admin. Les clés dans `src/data/api-keys.json` ont toutes ce rôle, donc accès complet à l'API. En Revanche si on se register on peut simplement `GET`

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/recipe` | Liste paginée des recettes |
| GET | `/api/recipe/:id` | Détail d'une recette |
| POST | `/api/recipe` | Crée une recette |
| PATCH | `/api/recipe/:id` | Modifie partiellement une recette |
| DELETE | `/api/recipe/:id` | Supprime une recette |

### Body de `POST /api/recipe` (et `PATCH`, tous les champs en optionnel)

```json
{
  "title": "Tarte aux pommes",
  "description": "Une tarte aux pommes traditionnelle avec une pâte croustillante.",
  "ingredients": ["pâte brisée", "pommes", "sucre", "cannelle", "beurre"],
  "difficulty": "medium",
  "prepTimeMinutes": 45,
  "servings": 6
}
```

## Documentation Swagger

Toutes les routes, les DTOs et les codes de retour possibles sont documentés sur `/api/docs`.
