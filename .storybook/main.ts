import type { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '../preset.js',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal(config) {
    config.define = {
      ...config.define,
      global: 'window',
    };

    return config;
  },
} satisfies StorybookConfig;

export default config;
