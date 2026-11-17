import next from 'eslint-config-next';

const config = [
  ...next,
  { ignores: ['legacy/**', '.next/**', 'node_modules/**', 'docs/**', 'public/**', 'drizzle/**', 'next-env.d.ts'] },
  { rules: { 'react-hooks/set-state-in-effect': 'off', 'react-hooks/purity': 'off', 'react-hooks/incompatible-library': 'off', '@next/next/no-html-link-for-pages': 'off', '@next/next/no-img-element': 'off' } },
];
export default config;
