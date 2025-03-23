import { formatCurrency } from "../helpers"

type amounDisplayProps = {
    label?: string,
    amount: number
}
export default function AmountDisplay({ label, amount }: amounDisplayProps) {
    return (
        <p className="text-2xl text-blue-600 font-bold">
            {label && `${label}: `}
            <span className="font-bold text-black">{formatCurrency(amount)}</span>
        </p>
    )
}
