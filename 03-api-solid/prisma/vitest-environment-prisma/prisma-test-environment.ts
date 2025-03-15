import { Environment } from 'vitest/environments';

export default <Environment> {
  name: 'prisma',
  setup: async () => (
    { teardown() {} }
  ),
  transformMode: 'ssr',
};