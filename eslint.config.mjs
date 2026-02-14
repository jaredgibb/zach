import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
      {
            ignores: [
                  '**/node_modules/**',
                  '**/.next/**',
                  '**/out/**',
                  '**/build/**',
                  '**/dist/**',
                  '**/coverage/**',
            ],
      },
      ...nextVitals,
      ...nextTypescript,
      {
            rules: {
                  '@next/next/no-img-element': 'off',
                  'react/no-unescaped-entities': 'off',
            },
      },
];

export default eslintConfig;
