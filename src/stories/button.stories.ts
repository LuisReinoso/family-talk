import { Story, Meta } from '@storybook/angular';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';

export default {
  title: 'Primitives/FtButton',
  component: FtButtonComponent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'info', 'danger', 'icon', 'ai', 'question'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta;

const Template: Story<FtButtonComponent> = (args: FtButtonComponent) => ({
  component: FtButtonComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = { variant: 'primary', size: 'md', icon: '', disabled: false, loading: false };

export const Info = Template.bind({});
Info.args = { variant: 'info', size: 'md', icon: '', disabled: false, loading: false };

export const Danger = Template.bind({});
Danger.args = { variant: 'danger', size: 'md', icon: '', disabled: false, loading: false };

export const AI = Template.bind({});
AI.args = { variant: 'ai', size: 'md', icon: '🤖', disabled: false, loading: false };

export const Icon = Template.bind({});
Icon.args = { variant: 'icon', size: 'md', icon: '⚙️', disabled: false, loading: false };

export const Loading = Template.bind({});
Loading.args = { variant: 'primary', size: 'md', loading: true };

export const Disabled = Template.bind({});
Disabled.args = { variant: 'primary', size: 'md', disabled: true };

export const Small = Template.bind({});
Small.args = { variant: 'primary', size: 'sm', icon: '' };

export const Large = Template.bind({});
Large.args = { variant: 'primary', size: 'lg', icon: '🔀' };