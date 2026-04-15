import { Story, Meta } from '@storybook/angular';
import { FtPlayerCardComponent } from 'src/app/ft-ui/player-card/ft-player-card.component';

export default {
  title: 'Composites/FtPlayerCard',
  component: FtPlayerCardComponent,
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['available', 'selected', 'answered', 'expired'],
    },
  },
} as Meta;

const Template: Story<FtPlayerCardComponent> = (args: FtPlayerCardComponent) => ({
  component: FtPlayerCardComponent,
  props: args,
});

export const Available = Template.bind({});
Available.args = {
  name: 'Maria',
  avatarUrl: './assets/avatars/girl-1.png',
  color: '#3f297e',
  timeRemaining: 600,
  state: 'available',
};

export const Selected = Template.bind({});
Selected.args = {
  name: 'Fernando',
  avatarUrl: './assets/avatars/boy-1.png',
  color: '#1d61ac',
  timeRemaining: 540,
  state: 'selected',
};

export const Answered = Template.bind({});
Answered.args = {
  name: 'Daniel',
  avatarUrl: './assets/avatars/boy-2.png',
  color: '#209b6c',
  timeRemaining: 0,
  state: 'answered',
};

export const Expired = Template.bind({});
Expired.args = {
  name: 'Juan',
  avatarUrl: './assets/avatars/boy-3.png',
  color: '#e6471d',
  timeRemaining: 0,
  state: 'expired',
};