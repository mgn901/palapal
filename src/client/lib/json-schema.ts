import {
  Ajv,
  type ValidateFunction as AjvValidateFunction,
  type AnySchema,
} from "ajv";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const ajv = new Ajv();

export type JsonSchema = JSONSchema & AnySchema;

export type TypeFromSchema<S extends JsonSchema | undefined> =
  S extends JsonSchema ? FromSchema<S> : unknown;

interface ValidateFunction<S extends JsonSchema | undefined> {
  (value: unknown): value is TypeFromSchema<S>;
  readonly errors?: AjvValidateFunction["errors"];
}

export const validateFunctionFromSchema = (
  schema: JsonSchema | undefined,
): ValidateFunction<typeof schema> => {
  if (schema === undefined) {
    return (value): value is unknown => true;
  }
  return ajv.compile(schema);
};

export class JsonInvalidException extends Error {
  public readonly exceptionName = "JsonInvalidException";
  public readonly messages: string[];

  static {
    JsonInvalidException.prototype.name = "JsonInvalidException";
  }

  constructor(messages: string[]) {
    super(messages.join(""));
    this.name = "JsonInvalidException";
    this.exceptionName = "JsonInvalidException";
    this.messages = messages;
  }
}

export const jsonInvalidExceptionFromAjvErros = (
  errors: NonNullable<AjvValidateFunction["errors"]>,
): JsonInvalidException =>
  new JsonInvalidException(
    (errors ?? []).map((error) => error.message).filter(isString),
  );

const isString = (value: unknown): value is string => typeof value === "string";
