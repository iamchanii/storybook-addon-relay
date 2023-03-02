import { makeDecorator } from '@storybook/addons';
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

export interface WithRelayParameters<TQuery extends OperationType> {
  query: GraphQLTaggedNode;
  variables?: TQuery['variables'];
  mockResolvers?: MockPayloadGenerator.MockResolvers;
  getReferenceEntries: (queryResult: TQuery['response']) => [string, unknown][];
}

export const withRelay = makeDecorator({
  name: 'withRelay',
  parameterName: 'relay',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { parameters }) => {
    const {
      query,
      variables = {},
      mockResolvers = {},
      getReferenceEntries,
    } = parameters;

    const Renderer = () => {
      const queryResult = useLazyLoadQuery(query, variables);
      Object.assign(
        context.args,
        Object.fromEntries(getReferenceEntries(queryResult)),
      );

      return getStory(context) as any;
    };

    const environment = createMockEnvironment();

    environment.mock.queueOperationResolver(operation => {
      return MockPayloadGenerator.generate(operation, mockResolvers);
    });

    return (
      <RelayEnvironmentProvider environment={environment}>
        <Renderer />
      </RelayEnvironmentProvider>
    );
  },
});
