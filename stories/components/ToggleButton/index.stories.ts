import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import ToggleButton from ".";

const meta = {
  title: "Form/ToggleButton",
  component: ToggleButton,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},
  args: { onLogin: fn(), initialIsOn: false },
} satisfies Meta<typeof ToggleButton>;

export default meta;

export const Default = {
  args: {
    onLogin: () => console.log("sssss"),
    initialIsOn: true,
  },
};

// ts 방식
// const ToggleButtonStory = {
//   component: ToggleButton,
//   title: "ToggleButton",
//   tags: ["autodocs"],
//   excludeStories: /.*Data$/,
//   // args: {},
//   args: {
//     initialIsOn: false,
//   },
// };
// export default ToggleButtonStory;

// tsx 방식?
// export default {
//   title: "Components/ToggleButton",
//   component: ToggleButton,
// } as any;

// const Template: any = (args: any) => <ToggleButton {...args} />;

// export const Default = Template.bind({});
// Default.args = {
//   initialIsOn: false,
// };
