import { beforeAll, describe, expect, it } from 'vitest';

let migrateState;

beforeAll(async () => {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
  ({ migrateState } = await import('./store.js'));
});

describe('migración defensiva del estado', () => {
  it('completa secciones faltantes de una versión anterior', () => {
    const migrated = migrateState({
      version: 0,
      onboarded: true,
      profile: { name: 'FACU' },
      training: { settings: { duration: 40 } },
    });

    expect(migrated.onboarded).toBe(true);
    expect(migrated.profile.name).toBe('FACU');
    expect(migrated.training.settings.duration).toBe(40);
    expect(migrated.training.exercises.length).toBeGreaterThan(0);
    expect(migrated.nutrition.meals.length).toBeGreaterThan(0);
    expect(migrated.arena.skills.length).toBe(28);
  });

  it('repara colecciones corruptas sin borrar el perfil', () => {
    const migrated = migrateState({ profile: { name: 'FACU' }, tasks: null, skills: 'invalid' });
    expect(migrated.profile.name).toBe('FACU');
    expect(Array.isArray(migrated.tasks)).toBe(true);
    expect(migrated.skills).toHaveLength(20);
  });
});
