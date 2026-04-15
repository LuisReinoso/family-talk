module.exports = {
  stories: ['../src/stories/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-actions'],
  framework: '@storybook/angular',
  core: {
    builder: 'webpack5',
  },
};