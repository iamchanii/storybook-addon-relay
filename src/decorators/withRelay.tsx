import { makeDecorator } from '@storybook/addons';
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

export interface WithRelayParameters<
  TQuery extends OperationType,
  TResolvers = {},
> {
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
  mockResolvers?: Partial<
    {
      [ResolverTypeName in keyof TResolvers & string]: (
        context: MockPayloadGenerator.MockResolverContext,
        generateId: () => number,
      ) => TResolvers[ResolverTypeName] extends infer ResolverType
        ? ResolverType extends (...args: any[]) => any ? never
        : {
          [ResolverTypeFieldName in keyof ResolverType]: ResolverType[ResolverTypeFieldName] extends infer U
            ? U extends (...args: any[]) => infer ResolverTypeFieldValue ? ResolverTypeFieldValue
            : ResolverType[ResolverTypeFieldName]
            : ResolverType[ResolverTypeFieldName];
        }
        : never;
    }
  >;

  /**
   * A function that returns an array of entries to be added to the story's args.
   *
   * @param queryResult Result of the useLazyLoadQuery hook with the query passed as parameter.
   * @returns An array of entries to be added to the story's args.
   */
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
