import { Slot } from "@radix-ui/react-slot";

export interface TextProps {
    as?: string;
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}
export function Text({ as = "span", children, asChild, className }: TextProps) {
    const Comp = asChild ? Slot : as;
    return (
        <Comp className={` text-gray-100 font-sans ${className}`}>
            {children}
        </Comp>
    );
}
