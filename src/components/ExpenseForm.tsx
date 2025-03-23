import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: "",
        category: "",
        date: new Date
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ["amount"].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const [error, setError] = useState("")
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if (!state.editingID) return;
        const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingID)[0]
        setExpense(editingExpense)
        setPreviousAmount(editingExpense.amount)
    }, [state.editingID])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (Object.values(expense).includes("")) {
            setError("Todos los Campos son Obligatorios")
            return
        }

        // validate that I do not exceed the budget limit
        if ((expense.amount - previousAmount) > remainingBudget) {
            setError("Ese Gasto se sale del presupuesto")
            return
        }

        // Add or Update expense
        if (state.editingID) {
            dispatch({ type: "update-expense", payload: { expense: { id: state.editingID, ...expense } } })
        } else {
            dispatch({ type: "add-expense", payload: { expense } })
        }

        setExpense({
            amount: 0,
            expenseName: "",
            category: "",
            date: new Date
        })
        setPreviousAmount(0)
    }
    return (
        <form action="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="mb-4 upercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
            >
                {state.editingID ? "Editar Gasto" : "Nuevo Gasto"}
            </legend>
            {error && <ErrorMessage> {error}</ErrorMessage>}

            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
                <input
                    type="text"
                    id="expenseName"
                    placeholder="Anade el nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="amount" className="text-xl">Cantidad:</label>
                <input
                    type="Number"
                    id="amount"
                    placeholder="Anade la cantidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}

                />
            </div>
            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="category" className="text-xl">Categoria:</label>
                <select
                    id="category"
                    className="bg-slate-100 p-2"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value=""> - - Seleccione - -</option>
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="amount" className="text-xl">Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 py-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                />
            </div>
            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingID ? "Guardar Cambios" : "Registrar Gasto"}
            />
        </form>
    )
}
