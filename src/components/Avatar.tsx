import Image from "next/image";
import { User, UserCircle } from "phosphor-react";

type Props = {
    avatar_url: string | undefined;
    alt?: string | undefined;
    width?: number;
    height?: number;
};
export function Avatar({
    avatar_url,
    alt = "",
    width = 64,
    height = 64,
}: Props) {
    return (
        <>
            {avatar_url && (
                <Image
                    src={avatar_url}
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-full border-2 p-1 border-red-900"
                />
            )}

            {!avatar_url && (
                <User
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-full border-2 p-1 border-red-900"
                />
            )}
        </>
    );
}
