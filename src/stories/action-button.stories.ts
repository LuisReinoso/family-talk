import { Story, Meta } from '@storybook/angular';
import { FtActionButtonComponent } from 'src/app/ft-ui/action-button/ft-action-button.component';

export default {
  title: 'Composites/FtActionButton',
  component: FtActionButtonComponent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['ai', 'question'],
    },
  },
} as Meta;

const Template: Story<FtActionButtonComponent> = (args: FtActionButtonComponent) => ({
  component: FtActionButtonComponent,
  props: args,
});

export const AIButton = Template.bind({});
AIButton.args = { icon: '🤖', text: 'Generate with AI', variant: 'ai', loading: false };

export const QuestionButton = Template.bind({});
QuestionButton.args = { icon: '❓', text: 'Change question', variant: 'question', loading: false };

export const Loading = Template.bind({});
Loading.args = { icon: '🤖', text: 'Generating...', variant: 'ai', loading: true };