type TypePredicate<T> = (value: unknown) => value is T;

type TypePredicateConstraint = TypePredicate<unknown>;

type ExtractTypeFromTypePredicate<T extends TypePredicateConstraint> =
  T extends (value: unknown) => value is infer U ? U : never;

const isPromise = <T>(object: unknown): object is Promise<T> =>
  typeof object === "object" &&
  object !== null &&
  "then" in object &&
  typeof object.then === "function";

type ReturnExceptionReturnValue<ReturnValue, Exception> =
  ReturnValue extends Promise<unknown>
    ? Promise<[Awaited<ReturnValue>, undefined] | [undefined, Exception]>
    : [ReturnValue, undefined] | [undefined, Exception];

export const returnException =
  <
    Args extends Array<unknown>,
    ReturnValue,
    Checkers extends Array<(value: unknown) => value is {}>,
  >(
    fn: (...args: Args) => ReturnValue,
    checkers?: Checkers,
  ) =>
  (
    ...args: Args
  ): ReturnExceptionReturnValue<
    ReturnValue,
    ExtractTypeFromTypePredicate<Checkers[number]>
  > => {
    type Return = ReturnExceptionReturnValue<
      ReturnValue,
      ExtractTypeFromTypePredicate<Checkers[number]>
    >;

    try {
      const result = fn(...args);

      if (isPromise<ReturnValue>(result)) {
        return result
          .then((value) => [value, undefined])
          .catch((error) => {
            if (!checkers) {
              return [undefined, error];
            }

            if (checkers.every((checker) => !checker(error))) {
              throw error;
            }

            return [undefined, error];
          }) as Return;
      }

      return [result, undefined] as Return;
    } catch (error) {
      if (!checkers) {
        return [undefined, error] as Return;
      }

      if (checkers.every((checker) => !checker(error))) {
        throw error;
      }

      return [undefined, error] as Return;
    }
  };

export const retex = <
  ReturnValue,
  Checkers extends Array<(value: unknown) => value is {}>,
>(
  fn: () => ReturnValue,
  checkers?: Checkers,
): ReturnExceptionReturnValue<
  ReturnValue,
  ExtractTypeFromTypePredicate<Checkers[number]>
> => {
  return returnException(fn, checkers)();
};
