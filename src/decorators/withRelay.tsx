import { makeDecorator } from '@storybook/addons';
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { GraphQLSingularResponse, GraphQLTaggedNode, OperationDescriptor, OperationType } from 'relay-runtime';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';
import { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';
import { OperationMockResolver } from 'relay-test-utils/lib/RelayModernMockEnvironment';
import { InferMockResolvers } from './types';

export type WithRelayParameters<
  TQuery extends OperationType,
  TResolvers = {},
> =
  & {
    /**
     * A GraphQLTaggedNode returned by the relay's graphql`...` template literal.
     */
    query: GraphQLTaggedNode;

    /**
     * Optional. Variables to pass to the query.
     */
    variables?: TQuery['variables'];

    /**
     * Optional. Mock resolver object pass to the relay-test-utils MockPayloadGenerator.generate function.
     * If you use TResolver type argument, you can get type safety <3
     */
    mockResolvers?: InferMockResolvers<TResolvers>;

    /**
     * Optional. A function which allows you to override the default MockPayloadGenerator.generate function.
     */
    generateFunction?: (
        operation: OperationDescriptor,
        mockResolvers?: MockResolvers | null,
    ) => GraphQLSingularResponse;

    /**
     * A function that returns an entry to be added to the story's args.
     *
     * @param queryResult Result of the useLazyLoadQuery hook with the query passed as parameter.
     * @returns An entry to be added to the story's args.
     */
  }
  & (
    | {
      getReferenceEntry: (queryResult: TQuery['response']) => [string, unknown];
      getReferenceEntries?: never;
    }
    | {
      getReferenceEntries: (
        queryResult: TQuery['response'],
      ) => Array<[string, unknown]>;
      getReferenceEntry?: never;
    }
  );

export const withRelay = makeDecorator({
  name: 'withRelay',
  parameterName: 'relay',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { parameters }) => {
    const pars = parameters as WithRelayParameters<any>;

    const { query, variables = {}, mockResolvers = {} } = pars;

    if (pars.getReferenceEntries && pars.getReferenceEntry) {
      throw new Error(
        'Both getReferenceEntries and getReferenceEntry cant be defined',
      );
    }

    const Renderer = () => {
      const queryResult = useLazyLoadQuery(query, variables);
      const entries = pars.getReferenceEntries
        ? pars.getReferenceEntries(queryResult)
        : [pars.getReferenceEntry(queryResult)];
      Object.assign(context.args, Object.fromEntries(entries));

      return getStory(context) as any;
    };

    const environment = createMockEnvironment();

    environment.mock.queueOperationResolver((operation) => {
      if (pars.generateFunction) {
        return pars.generateFunction(operation, mockResolvers);
      }
      return MockPayloadGenerator.generate(operation, mockResolvers);
    });

    environment.mock.queuePendingOperation(query, variables);

    return (
      <RelayEnvironmentProvider environment={environment}>
        <Renderer />
      </RelayEnvironmentProvider>
    );
  },
});
