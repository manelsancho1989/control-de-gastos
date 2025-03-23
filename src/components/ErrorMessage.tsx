import { PropsWithChildren } from 'react'

export default function ErrorMessage({ children }: PropsWithChildren) {
    return (
        <p className='bg-red-600 text-white font-bold text-sm text-center py-2'>{children}</p>
    )
}
