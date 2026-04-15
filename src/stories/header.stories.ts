import { Story, Meta } from '@storybook/angular';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';

export default {
  title: 'Primitives/FtHeader',
  component: FtHeaderComponent,
} as Meta;

const Template: Story<FtHeaderComponent> = (args: FtHeaderComponent) => ({
  component: FtHeaderComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = { title: 'Reuniones familiares', showConfig: true, configLabel: 'Configurar' };

export const NoConfig = Template.bind({});
NoConfig.args = { title: 'Configurar idioma', showConfig: false };