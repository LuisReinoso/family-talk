import { Story, Meta } from '@storybook/angular';
import { FtAvatarPickerComponent } from 'src/app/ft-ui/avatar-picker/ft-avatar-picker.component';

export default {
  title: 'Composites/FtAvatarPicker',
  component: FtAvatarPickerComponent,
} as Meta;

const Template: Story<FtAvatarPickerComponent> = (args: FtAvatarPickerComponent) => ({
  component: FtAvatarPickerComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  avatars: ['./assets/avatars/boy-1.png', './assets/avatars/boy-2.png', './assets/avatars/boy-3.png', './assets/avatars/girl-1.png', './assets/avatars/girl-2.png', './assets/avatars/girl-3.png'],
  selectedAvatar: './assets/avatars/boy-1.png',
};