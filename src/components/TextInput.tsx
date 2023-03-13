import {
    ForwardRefRenderFunction,
    InputHTMLAttributes,
    ReactNode,
    TextareaHTMLAttributes,
    forwardRef,
} from "react";
import { Slot } from "@radix-ui/react-slot";

export interface TextInputRootProps {
    children: ReactNode;
}
function TextInputRoot({ children }: TextInputRootProps) {
    return (
        <div
            className={`flex items-center gap-3 py-2 px-3 rounded bg-gray-900 w-full ring-red-900 focus-within:ring-2 focus:bg-red-700  `}
        >
            {children}
        </div>
    );
}
TextInputRoot.displayName = "TextInput.Root";

export interface TextInputInputProps
    extends InputHTMLAttributes<HTMLInputElement> {}

const Input: ForwardRefRenderFunction<HTMLInputElement, TextInputInputProps> = (
    { ...props },
    ref
) => {
    return (
        <input
            className={`bg-transparent h-6  flex-1 text-gray-100 text-xs font-normal  autofill:duration-[999999999ms] placeholder:text-gray-500 focus:outline-none outline-none ring-red-300`}
            {...props}
            ref={ref}
        />
    );
};

const TextInputInput = forwardRef(Input);
TextInputInput.displayName = "TextInput.Input";

export interface TextInputAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: ForwardRefRenderFunction<
    HTMLTextAreaElement,
    TextInputAreaProps
> = ({ ...props }, ref) => {
    return (
        <textarea
            className={`bg-transparent  flex-1 text-gray-100 text-xs font-normal  autofill:duration-[999999999ms] placeholder:text-gray-500 focus:outline-none outline-none ring-red-300`}
            {...props}
            ref={ref}
        />
    );
};

const TextInputArea = forwardRef(TextArea);
TextInputArea.displayName = "TextInput.Area";



export interface TextInputIconProps {
    children: ReactNode;
}
function TextInputIcon({ children }: TextInputIconProps) {
    return <Slot className="w-6 h-6 text-gray-400">{children}</Slot>;
}

TextInputIcon.displayName = "TextInput.Icon";

export const TextInput = {
    Root: TextInputRoot,
    Input: TextInputInput,
    Area: TextInputArea,
    Icon: TextInputIcon,
};
