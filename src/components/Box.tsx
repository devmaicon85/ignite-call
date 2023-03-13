interface Props {
    children: React.ReactNode;
    className?: string;
}

export function Box({ children, className }: Props) {
    return <div className={`gap-2 mt-4 border rounded-lg border-gray-700 bg-gray-800 px-4 py-4 ${className}`}>{children}</div>;
}
