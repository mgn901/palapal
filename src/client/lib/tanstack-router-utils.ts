import {
  type JsonSchema,
  jsonInvalidExceptionFromAjvErros,
  type TypeFromSchema,
  validateFunctionFromSchema,
} from "./json-schema";

export const constrainFunctionFromSchema = <S extends JsonSchema>(
  schema: S,
): ((value: unknown) => TypeFromSchema<S>) => {
  const validate = validateFunctionFromSchema(schema);
  return (value) => {
    if (!validate(value)) {
      throw jsonInvalidExceptionFromAjvErros(validate.errors ?? []);
    }
    return value as TypeFromSchema<S>;
  };
};
