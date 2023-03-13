import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}
export function Button({
    children,
    asChild,
    className,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            className={`${className} flex px-4 h-10 justify-center items-center gap-2 text-white bg-red-700  transition-all rounded font-medium text-sm w-full max-w-md disabled:bg-gray-400 hover:bg-red-900 cursor-pointer focus:ring-2 ring-white`}
            {...props}
        >
            {children}
        </Comp>
    );
}
