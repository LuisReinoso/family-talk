import { Story, Meta } from '@storybook/angular';
import { FtBadgeComponent } from 'src/app/ft-ui/badge/ft-badge.component';

export default {
  title: 'Primitives/FtBadge',
  component: FtBadgeComponent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['success', 'expired', 'info'],
    },
  },
} as Meta;

const Template: Story<FtBadgeComponent> = (args: FtBadgeComponent) => ({
  component: FtBadgeComponent,
  props: args,
});

export const Success = Template.bind({});
Success.args = { variant: 'success', icon: '✓' };

export const Expired = Template.bind({});
Expired.args = { variant: 'expired', icon: '⏱' };

export const Info = Template.bind({});
Info.args = { variant: 'info', icon: 'i' };