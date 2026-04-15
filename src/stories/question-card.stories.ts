import { Story, Meta } from '@storybook/angular';
import { FtQuestionCardComponent } from 'src/app/ft-ui/question-card/ft-question-card.component';

export default {
  title: 'Composites/FtQuestionCard',
  component: FtQuestionCardComponent,
} as Meta;

const Template: Story<FtQuestionCardComponent> = (args: FtQuestionCardComponent) => ({
  component: FtQuestionCardComponent,
  props: args,
});

export const WithQuestion = Template.bind({});
WithQuestion.args = {
  questionText: '¿Creen que la comunicación es la clave para construir buenas relaciones?',
  label: 'Pregunta',
};

export const LongQuestion = Template.bind({});
LongQuestion.args = {
  questionText: '¿Cuál es la lección más importante que has aprendido de un miembro de tu familia y cómo ha impactado tu vida diaria?',
  label: 'Pregunta',
};

export const Empty = Template.bind({});
Empty.args = {
  questionText: null,
  label: 'Pregunta',
};