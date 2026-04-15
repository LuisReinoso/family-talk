import { Story, Meta } from '@storybook/angular';
import { FtColorPickerComponent } from 'src/app/ft-ui/color-picker/ft-color-picker.component';

export default {
  title: 'Composites/FtColorPicker',
  component: FtColorPickerComponent,
} as Meta;

const Template: Story<FtColorPickerComponent> = (args: FtColorPickerComponent) => ({
  component: FtColorPickerComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  colors: ['#3f297e', '#1d61ac', '#169ed8', '#209b6c', '#60b236', '#c6bf27', '#f7a416', '#e6471d', '#dc0936', '#e5177b'],
  selectedColor: '#3f297e',
};