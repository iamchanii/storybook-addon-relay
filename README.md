# storybook-addon-relay

[![npm version](https://badge.fury.io/js/@imchhh%2Fstorybook-addon-relay.svg)](https://badge.fury.io/js/@imchhh%2Fstorybook-addon-relay)

A Storybook addon for Relay

## Installation

```
yarn add -D @imchhh/storybook-addon-relay
```

## Getting Started

Add `@imchhh/storybook-addon-relay` into `addons` array of `.storybook/main.c?(j|t)s`.

```ts
const config: StorybookConfig = {
  addons: [
    // ...
    "@imchhh/storybook-addon-relay",
  ],
};
```

Add `relay` object into your story's `parameters`. This is an example:

```ts
export default {
  component: ProposalBuildingPropertyCostEffectiveBadge,
};

const query = graphql`
  query ProposalBuildingPropertyCostEffectiveBadgeStorybookQuery
  @relay_test_operation {
    node(id: "test-id") {
      ... on ProposalBuildingProperty {
        ...ProposalBuildingPropertyCostEffectiveBadge
      }
    }
  }
`;

export const Default: StoryObj = {
  name: "costEffective=true",
  parameters: {
    relay: {
      query,
      getReferenceEntries: (data) => [["data", data.node]],
      mockResolvers: {
        ProposalBuildingProperty: () => ({
          costEffective: true,
        }),
      },
    },
  },
};
```

If you're using TypeScript 4.9+, you can get type safe with `WithRelayParameters` and `satisfies` keyword.

```ts
import { WithRelayParameters } from "@imchhh/storybook-addon-relay";

// ...

export const Default: StoryObj = {
  name: "costEffective=true",
  parameters: {
    relay: {
      query,
      getReferenceEntries: (data /* typed! */) => [["data", data.node]],
      mockResolvers: {
        /* typed! */
        ProposalBuildingProperty: () => ({
          costEffective: true,
        }),
      },
    } satisfies WithRelayParameters<
      ProposalBuildingPropertyCostEffectiveBadgeStorybookQuery,
      Resolvers
      // You can generate resolver types using graphql-codegen.
    >,
  },
};
```

## License

MIT
