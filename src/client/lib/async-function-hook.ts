import { defineRouter } from "@mgn901/mgn901-utils-ts/router-utils";
import { useCallback, useEffect, useReducer } from "react";

const wrapError = (rawError: unknown): Error => {
  const wrappedError = new Error();
  wrappedError.cause = rawError;
  return rawError instanceof Error ? rawError : wrappedError;
};

export type AsyncFunctionHookStateBase<R> =
  | readonly [result: undefined, error: undefined, isPending: boolean]
  | readonly [result: R, error: undefined, isPending: boolean]
  | readonly [result: undefined, error: Error, isPending: boolean];

export type AsyncFunctionHookState<A extends unknown[], R> = [
  ...AsyncFunctionHookStateBase<R>,
  run: (...args: A) => Promise<R>,
];

type AsyncFunctionHookStateActions<R> =
  | { type: "start" }
  | { type: "success"; result: R }
  | { type: "fail"; error: Error };

const asyncFunctionHookStateReducer = <R>(
  state: AsyncFunctionHookStateBase<R>,
  action: AsyncFunctionHookStateActions<R>,
) => {
  const actionHandlers = defineRouter(
    {
      start: (_param: { type: "start" }): AsyncFunctionHookStateBase<R> => {
        return state;
      },
      success: (param: {
        type: "success";
        result: R;
      }): AsyncFunctionHookStateBase<R> => [param.result, undefined, false],
      fail: (param: {
        type: "fail";
        error: Error;
      }): AsyncFunctionHookStateBase<R> => [undefined, param.error, false],
    },
    "type",
  );
  return actionHandlers(action);
};

export const useAsyncFunction = <A extends unknown[], R>(
  func: (...args: A) => Promise<R>,
): AsyncFunctionHookState<A, R> => {
  const [state, dispatch] = useReducer<
    AsyncFunctionHookStateBase<R>,
    [AsyncFunctionHookStateActions<R>]
  >(asyncFunctionHookStateReducer, [undefined, undefined, false]);

  const run = async (...args: A): Promise<R> => {
    dispatch({ type: "start" });
    try {
      const rawResult = await func(...args);
      dispatch({ type: "success", result: rawResult });
      return rawResult;
    } catch (rawError: unknown) {
      const error = wrapError(rawError);
      dispatch({ type: "fail", error });
      throw error;
    }
  };
  const memoizedRun = useCallback(run, [func]);

  return [...state, memoizedRun] as const;
};

export const useAsyncFunctionResult = <A extends unknown[], R>(
  func: (...args: A) => Promise<R>,
  ...args: A
): AsyncFunctionHookState<A, R> => {
  const state = useAsyncFunction(func);

  // biome-ignore lint/correctness/useExhaustiveDependencies: splitting args into dependencies
  useEffect(() => {
    state[3](...args);
  }, [...args, state[3]]); // depends on the original function rather than the wrapped function to avoid re-renders

  return state;
};
