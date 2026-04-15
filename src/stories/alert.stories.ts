import { Story, Meta } from '@storybook/angular';
import { FtAlertComponent } from 'src/app/ft-ui/alert/ft-alert.component';

export default {
  title: 'Primitives/FtAlert',
  component: FtAlertComponent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['warn', 'error', 'info', 'success'],
    },
  },
} as Meta;

const Template: Story<FtAlertComponent> = (args: FtAlertComponent) => ({
  component: FtAlertComponent,
  template: `<ft-alert variant="${args.variant}" [dismissible]="${args.dismissible}">${args.variant} alert message</ft-alert>`,
  props: args,
});

export const Warn = Template.bind({});
Warn.args = { variant: 'warn', dismissible: true };

export const Error = Template.bind({});
Error.args = { variant: 'error', dismissible: false };

export const Info = Template.bind({});
Info.args = { variant: 'info', dismissible: true };

export const Success = Template.bind({});
Success.args = { variant: 'success', dismissible: false };