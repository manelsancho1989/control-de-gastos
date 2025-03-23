import { ChangeEvent } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";

export default function FilterbyCategory() {

    const { dispatch } = useBudget()

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "add-category-filter", payload: { id: e.target.value } })
    }

    return (
        <div className="bg-white shadow-lg p-10">
            <form>
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <label htmlFor="category">Filtrar Gastos</label>
                    <select
                        id="category"
                        className="flex-1 rounded p-3 bg-slate-100"
                        onChange={handleChange}
                    >
                        <option value="">- - Todas las Categorias - -</option>
                        {categories.map(category => (
                            <option
                                value={category.id}
                                key={category.id}
                            >{category.name}</option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    )
}
