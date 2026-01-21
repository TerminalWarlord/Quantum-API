'use client'

import Unauthorized from '@/components/ui/unauthorized';
import { IconExclamationCircleFilled, IconHandStop } from '@tabler/icons-react';
import { useEffect, useState } from 'react'


enum ErrorTypes {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN"
}
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [errorType, setErrorType] = useState<ErrorTypes | null>();
    useEffect(() => {
        if ((error.message as string).includes('Unauthorized')) {
            setErrorType(ErrorTypes.UNAUTHORIZED);
        }
        console.log(error.message)
    }, [error]);



    if (errorType === ErrorTypes.UNAUTHORIZED || errorType === ErrorTypes.FORBIDDEN) {
        return <Unauthorized />
    }

    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center">
            <IconExclamationCircleFilled size={40} />
            <p>Something went wrong!</p>
        </div>
    )
}