import { z } from 'Zod'

export const StatNames = ["hp", "atk", "def", "spa", "spd", "spe"] as const;
export type BaseStatName = typeof StatNames[number]

export const PokemonTypes = [
  "Normal", "Fire", "Water", "Electric",
  "Grass", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy"] as const;
export type PokeType = typeof PokemonTypes[number]

export const BaseStatSchema = z.object({
  statName: z.enum(StatNames),
  statValue: z.number(),
})

export const AbilitySchema = z.object({
  id: z.string(),
  displayName: z.string(),

  gameDescription: z.string(),
  effect: z.string(),
})

export const PokemonSchema = z.object({
  id: z.string().nonempty(),

  displayName: z.string().nonempty(),
  species: z.string().nonempty(),

  baseStats: BaseStatSchema.array(),
  baseStatTotal: z.number().refine((val) => val >= 0, { message: 'Negative dex number found!', }),

  type: z.enum(PokemonTypes).array(),

  imageUrl: z.string().nonempty(),

  nationalDexNumber: z.number(),
  pokedexEntryDescription: z.string(),

  abilitiesId: z.string().nonempty().array(),
  hiddenAbility: z.string().optional(),

  isMega: z.boolean(),
  generationalChanges: z.string().array(),

  evoTree: z.record(z.string().nonempty(),
    z.object({
      evolveReason: z.string().nonempty(),
      pokeId: z.string().nonempty(),
    }).array()
  ),

  variantName: z.string(),
});

// extract the inferred type
export type Pokemon = z.infer<typeof PokemonSchema>;
export type Ability = z.infer<typeof AbilitySchema>;
export type BaseStat = z.infer<typeof BaseStatSchema>;