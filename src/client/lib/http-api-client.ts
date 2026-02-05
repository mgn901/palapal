import type { OmitByValue } from "@mgn901/mgn901-utils-ts/utils.type";
import {
  type JsonSchema,
  jsonInvalidExceptionFromAjvErros,
  type TypeFromSchema,
  validateFunctionFromSchema,
} from "./json-schema";

export type HttpMethods =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

interface HttpApiClientSchema {
  params?: JsonSchema;
  querystring?: JsonSchema;
  headers?: JsonSchema;
  body?: JsonSchema;
  response?: JsonSchema;
}

interface HttpApiClientInput<S extends HttpApiClientSchema> {
  params: S["params"] extends JsonSchema ? TypeFromSchema<S["params"]> : never;
  querystring: S["querystring"] extends JsonSchema
    ? TypeFromSchema<S["querystring"]>
    : never;
  headers: S["headers"] extends JsonSchema
    ? TypeFromSchema<S["headers"]>
    : never;
  body: S["body"] extends JsonSchema ? TypeFromSchema<S["body"]> : never;
}

export const httpApiClientFromSchema = <S extends HttpApiClientSchema>(
  schema: Readonly<S>,
  method: HttpMethods,
  pathname: (params: TypeFromSchema<S["params"]>) => string,
  headers: HeadersInit,
): ((
  input: OmitByValue<
    { [K in keyof HttpApiClientInput<S>]: HttpApiClientInput<S>[K] },
    never
  >,
) => Promise<TypeFromSchema<S["response"]>>) => {
  const validateParams = validateFunctionFromSchema(schema.params);
  const validateQuerystring = validateFunctionFromSchema(schema.querystring);
  const validateHeaders = validateFunctionFromSchema(schema.headers);
  const validateBody = validateFunctionFromSchema(schema.body);
  const validateResponse = validateFunctionFromSchema(schema.response);

  return async (input) => {
    const filledInput = {
      params: "params" in input ? input.params : undefined,
      querystring: "querystring" in input ? input.querystring : undefined,
      headers: "headers" in input ? input.headers : undefined,
      body: "body" in input ? input.body : undefined,
    };

    // validate input
    const validationResults = [
      validateParams(filledInput.params),
      validateQuerystring(filledInput.querystring),
      validateHeaders(filledInput.headers),
      validateBody(filledInput.body),
    ];
    if (validationResults.some((result) => !result)) {
      throw jsonInvalidExceptionFromAjvErros([
        ...(validateParams.errors ?? []),
        ...(validateQuerystring.errors ?? []),
        ...(validateHeaders.errors ?? []),
        ...(validateBody.errors ?? []),
      ]);
    }

    // construct URL
    const url = new URL(globalThis.location.href);
    url.pathname = pathname(filledInput.params as TypeFromSchema<S["params"]>);

    const searchParams = new URLSearchParams();
    for (const entry of Object.entries(filledInput.querystring ?? {})) {
      if (Array.isArray(entry[1])) {
        for (const value of entry[1]) {
          searchParams.append(entry[0], value as string);
        }
      } else {
        searchParams.append(entry[0], entry[1] as string);
      }
    }
    url.search = `?${searchParams.toString()}`;

    // send HTTP Request
    const response = await fetch(url, {
      method,
      headers: { ...headers, ...(filledInput.headers ?? {}) },
      ...(filledInput.body !== undefined
        ? { body: JSON.stringify(filledInput.body) }
        : {}),
    });
    const responseJson = await response.json();

    // validate response
    if (!validateResponse(responseJson)) {
      throw jsonInvalidExceptionFromAjvErros(validateResponse.errors ?? []);
    }

    return responseJson as TypeFromSchema<S["response"]>;
  };
};
