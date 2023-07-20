import { z } from 'Zod'

export const PokemonSchema = z.object({
  username: z.string(),
});

// extract the inferred type
export type Pokemon = z.infer<typeof PokemonSchema>;