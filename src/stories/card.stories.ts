import { Story, Meta } from '@storybook/angular';
import { FtCardComponent } from 'src/app/ft-ui/card/ft-card.component';

export default {
  title: 'Primitives/FtCard',
  component: FtCardComponent,
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta;

const Template: Story<FtCardComponent> = (args: FtCardComponent) => ({
  component: FtCardComponent,
  template: `<ft-card accentColor="" padding="${args.padding}"><p style="margin:0">Card content here</p></ft-card>`,
  props: args,
});

export const Default = Template.bind({});
Default.args = { padding: 'md', accentColor: '' };

export const WithAccent = Template.bind({});
WithAccent.args = { padding: 'md', accentColor: '#4caf50' };

export const Small = Template.bind({});
Small.args = { padding: 'sm', accentColor: '' };

export const Large = Template.bind({});
Large.args = { padding: 'lg', accentColor: '#17a2b8' };