import { Story, Meta } from '@storybook/angular';
import { FtConfigCardComponent } from 'src/app/ft-ui/config-card/ft-config-card.component';

export default {
  title: 'Composites/FtConfigCard',
  component: FtConfigCardComponent,
} as Meta;

const Template: Story<FtConfigCardComponent> = (args: FtConfigCardComponent) => ({
  component: FtConfigCardComponent,
  props: args,
});

export const Players = Template.bind({});
Players.args = { icon: '👥', label: 'Players', accentColor: '#4caf50' };

export const General = Template.bind({});
General.args = { icon: '⚙️', label: 'General', accentColor: '#ff9800' };

export const Language = Template.bind({});
Language.args = { icon: '🌐', label: 'Language', accentColor: '#2196f3' };

export const Questions = Template.bind({});
Questions.args = { icon: '❓', label: 'Questions', accentColor: '#9c27b0' };

export const AI = Template.bind({});
AI.args = { icon: '🤖', label: 'AI', accentColor: '#6c3ce0' };