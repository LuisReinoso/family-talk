import { Story, Meta } from '@storybook/angular';
import { FtInputComponent } from 'src/app/ft-ui/input/ft-input.component';

export default {
  title: 'Primitives/FtInput',
  component: FtInputComponent,
} as Meta;

const Template: Story<FtInputComponent> = (args: FtInputComponent) => ({
  component: FtInputComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = { label: 'Player name', placeholder: 'Enter name...', errorMessage: '' };

export const WithError = Template.bind({});
WithError.args = { label: 'Player name', placeholder: 'Enter name...', errorMessage: 'Name is required' };

export const NoLabel = Template.bind({});
NoLabel.args = { label: '', placeholder: 'Type something...', errorMessage: '' };