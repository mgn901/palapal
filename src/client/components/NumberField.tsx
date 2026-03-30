import { memo, type ReactNode } from "react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps,
} from "react-aria-components";
import { render } from "./render.tsx";

export const NumberField = memo((props: NumberFieldProps): ReactNode => {
  return <AriaNumberField {...props}>{render(props.children)}</AriaNumberField>;
});
