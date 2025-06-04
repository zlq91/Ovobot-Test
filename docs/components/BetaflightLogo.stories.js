import OvobotLogo from "./OvobotLogo.vue";

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
    title: "Logo",
    component: OvobotLogo,
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { OvobotLogo },
    template: '<Ovobot-logo v-bind="$props" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
    configuratorVersion: "1.0.0",
};
