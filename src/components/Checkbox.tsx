import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";

export interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {}
export function Checkbox(props: CheckboxProps) {
    return (
        <CheckboxPrimitive.Root
            className="w-6 h-6  bg-gray-900 rounded "
            {...props}
        >
            <CheckboxPrimitive.Indicator asChild>
                <Check weight="bold" className={`h-6 w-6 bg-red-900 rounded cursor`} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
