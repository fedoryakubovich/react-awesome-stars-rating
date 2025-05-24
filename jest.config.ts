import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const defaultPreset = createDefaultPreset({ tsconfig: 'tsconfig.spec.json' });

export default {
  setupFilesAfterEnv: ['./src/__tests__/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: { ...defaultPreset.transform },
  testMatch: ['**/__tests__/**/*.test.tsx'],
} satisfies Config;
