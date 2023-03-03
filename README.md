# storybook-addon-relay

[![npm version](https://badge.fury.io/js/@imchhh%2Fstorybook-addon-relay.svg)](https://badge.fury.io/js/@imchhh%2Fstorybook-addon-relay)

A Storybook add-on to write stories for Relay components.

[github_demo.webm](https://user-images.githubusercontent.com/26643843/222612688-ca0cc4b5-9173-4215-a5cb-b8a46f20219e.webm)

## Installation

Install the `@imchhh/storybook-addon-relay` package using the package manager of your choice:

```
yarn add -D @imchhh/storybook-addon-relay
```

Add `@imchhh/storybook-addon-relay` to the `addons` list in your `.storybook/main.c?(j|t)s` file:

```ts
const config: StorybookConfig = {
  addons: [
    // ...
    '@imchhh/storybook-addon-relay',
  ],
};
```

## Usage

Add a `relay` field to your story's `parameters`.

```ts
export const Default = {
  parameters: {
    relay: {
      query: graphql`...`,
      getReferenceEntry: (data) => ['data', data.node],
      variables: {},
      mockResolvers: {},
    },
  },
};
```

- `query`: A `GraphQLTaggedNode` returned by the Relay's `graphql` template literal. You should pass the query operation that uses the `@relay_test_operation` directive.
- `getReferenceEntry`: A function that returns an entry to be added to the story's args. It takes the result of the `useLazyLoadQuery` hook with the query passed as a parameter and returns an entry to be added to the story's args.
- `variables`: Optional. Variables to pass to the query.
- `mockResolvers`: Optional. A mock resolver object passed to the `relay-test-utils`' `MockPayloadGenerator.generate` function.

Here is a minimal example:

```tsx
// UserAvatar.tsx
export const UserAvatar = (props) => {
  const data = useFragment(
    graphql`
      fragment UserAvatar on User {
        profileImageUrl
      }
    `,
    props.user,
  );

  return <img src={data.profileImageUrl} alt="" />;
};

// UserAvatar.stories.tsx
import { StoryObj } from '@storybook/react';
import { graphql } from 'react-relay';
import { UserAvatar } from './UserAvatar';

export default {
  component: UserAvatar,
};

export const Default: StoryObj = {
  parameters: {
    relay: {
      query: graphql`
        query UserAvatarStoryQuery @relay_test_operation {
          node(id: "test-id") {
            ... on User {
              ...UserAvatar
            }
          }
        }
      `,
      getReferenceEntry: queryResult => ['user', queryResult.node],
      mockResolvers: {
        User: () => ({
          profileImageUrl: 'https://source.unsplash.com/random/400x400',
        }),
      },
    },
  },
};
```

### TypeScript (Optional)

If you are using TypeScript 4.9 or later, you can use the `WithRelayParameters` interface and the `satisfies` keyword to get type-safe:

```ts
// UserAvatar.stories.tsx
import { WithRelayParameters } from '@imchhh/storybook-addon-relay';
import { StoryObj } from '@storybook/react';
import { graphql } from 'react-relay';
import { UserAvatarStoryQuery } from '~/path/of/relay/artifacts';
import { UserAvatar } from './UserAvatar';

export default {
  component: UserAvatar,
};

export const Default: StoryObj = {
  parameters: {
    relay: {
      query: graphql`
        query UserAvatarStoryQuery @relay_test_operation {
          node(id: "test-id") {
            ... on User {
              ...UserAvatar
            }
          }
        }
      `,
      // Now `queryResult` is typed!
      getReferenceEntry: queryResult => ['user', queryResult.node],
      mockResolvers: {
        User: () => ({
          profileImageUrl: 'https://source.unsplash.com/random/400x400',
        }),
      },
    } satisfies WithRelayParameters<UserAvatarStoryQuery>,
  },
};
```

And you can pass the `Resolvers` type, which generated via [GraphQL Code Generator](https://the-guild.dev/graphql/codegen), as the second type parameter to `WithRelayParameters`.

```ts
// UserAvatar.stories.tsx
import { WithRelayParameters } from '@imchhh/storybook-addon-relay';
import { StoryObj } from '@storybook/react';
import { graphql } from 'react-relay';
import { Resolvers } from '~/path/of/codegen/generated';
import { UserAvatarStoryQuery } from '~/path/of/relay/artifacts';
import { UserAvatar } from './UserAvatar';

export default {
  component: UserAvatar,
};

export const Default: StoryObj = {
  parameters: {
    relay: {
      query: graphql`
        query UserAvatarStoryQuery @relay_test_operation {
          node(id: "test-id") {
            ... on User {
              ...UserAvatar
            }
          }
        }
      `,
      getReferenceEntry: queryResult => ['user', queryResult.node],
      // Now `mockResolvers` is typed!
      mockResolvers: {
        User: () => ({
          profileImageUrl: 'https://source.unsplash.com/random/400x400',
        }),
      },
    } satisfies WithRelayParameters<UserAvatarStoryQuery, Resolvers>,
  },
};
```

These are totally optional, so feel free to skip them

## Contribute

I don't have any plans to write or set up a contribution guide. If this library doesn't solve your problem or isn't sufficient, please create an issue and describe your situation or suggestion. I would appreciate it very much.

## License

MIT
