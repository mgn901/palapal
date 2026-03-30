import { memo, type ReactNode } from "react";
import { Input as AriaInput, type InputProps } from "react-aria-components";
import { renderClassName } from "./render.tsx";

export const Input = memo((props: {} & InputProps): ReactNode => {
  return (
    <AriaInput
      {...props}
      className={renderClassName(props.className, "outline-none")}
    >
      {props.children}
    </AriaInput>
  );
});
