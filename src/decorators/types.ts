import { MockPayloadGenerator } from 'relay-test-utils';
import { PartialDeep } from 'type-fest';

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

type ResolverReturnType<T> = T extends { resolve: infer U } ? ResolverReturnType<U>
  : T extends (...args: any[]) => infer U ? U
  : never;

type InferMockResolverFieldReturnType<T> = {
  [K in keyof T]: ResolverReturnType<T[K]> extends infer FieldResolverReturnType
    ? FieldResolverReturnType extends Primitive ? FieldResolverReturnType
    : PartialDeep<FieldResolverReturnType>
    : never;
};

export type InferMockResolvers<T> = T extends object ? T extends infer U ? U extends (...args: any[]) => any ? never
    : U extends object ? {
        [K in keyof U]?: (
          context: MockPayloadGenerator.MockResolverContext,
          generateId: () => string,
        ) => InferMockResolverFieldReturnType<U[K]>;
      }
    : never
  : never
  : never;
