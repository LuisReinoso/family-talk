import { Story, Meta } from '@storybook/angular';
import { FtCheckboxComponent } from 'src/app/ft-ui/checkbox/ft-checkbox.component';

export default {
  title: 'Primitives/FtCheckbox',
  component: FtCheckboxComponent,
} as Meta;

const Template: Story<FtCheckboxComponent> = (args: FtCheckboxComponent) => ({
  component: FtCheckboxComponent,
  props: args,
});

export const Unchecked = Template.bind({});
Unchecked.args = { checked: false, label: 'Enable feature', disabled: false };

export const Checked = Template.bind({});
Checked.args = { checked: true, label: 'Enable feature', disabled: false };

export const Disabled = Template.bind({});
Disabled.args = { checked: false, label: 'Enable feature', disabled: true };