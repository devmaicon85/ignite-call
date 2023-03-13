import { Slot } from "@radix-ui/react-slot";

export interface HeadingProps {
    as?: string;
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}
export function Heading({
    as = "h2",
    children,
    asChild,
    className,
}: HeadingProps) {
    const Comp = asChild ? Slot : as;
    return (
        <Comp className={` text-gray-100 font-sans font-bold ${className} `}>
            {children}
        </Comp>
    );
}
