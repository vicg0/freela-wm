import { TCategory } from "@/@types/Product";
import { Plus, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnHeader } from "./ColumnHeader";
import { Column } from "./Column";
import { Action } from "./Action";
import { Input } from "./Input";
import { Button } from "./Button";

interface TModalCarrinho {
  setFilter: Dispatch<SetStateAction<string>>;
}

export function ModalCategoria({ setFilter }: TModalCarrinho) {

  const [categorias, setCategorias] = useState<TCategory[]>([])
  const [nomeCategoria, setNomeCategoria] = useState('')

  const exit = () => setFilter('')

  const getCategories = async () => {

    try {
      const response = await fetch('http://localhost:8080/categorias')

      if (response.status === 200) {
        const data: TCategory[] = await response.json()

        setCategorias(data)

      }
    } catch (e) {
      console.log(e);

    }
  }

  const deleteCategoria = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/categorias/${id}`, {
        method: 'DELETE',
      })

      if (response.status === 204) {
        setCategorias(
          categorias.filter(categoria => categoria.id !== id)
        )
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  const criarCategoria = async () => {
    try {
      const response = await fetch('http://localhost:8080/categorias', {
        method: 'POST',
        body: JSON.stringify({
          nome: nomeCategoria
        }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      if(response.status === 201) {
        getCategories()
      }
    } catch(e) {
      console.log(e);
      
    }
  }

  return (
    <div onClick={e => setFilter('')} className="fixed z-[1000] h-full w-full bg-black bg-opacity-50 flex justify-center items-center">

      <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-8 p-5 w-1/2 rounded-lg max-h-[90%] overflow-y-auto">

        <header className="flex justify-between items-center">
          <p className="font-bold text-2xl">Produtos</p>

          <X className="cursor-pointer" size={24} onClick={exit} />
        </header>

        <div className="flex items-center justify-between">
          <Input placeholder="Nome da categoria" onChange={e => setNomeCategoria(e.target.value)} />
          <Button onClick={criarCategoria} text="Adicionar" className="h-full bg-green-500 px-4 py-2 rounded-md text-white flex gap-3" icon={<Plus size={24} />} />
        </div>

        <table className="w-full mt-6">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <ColumnHeader text={'Nome'} />
              <td>
              </td>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                <Column text={categoria.nome} />
                <td className="h-full flex items-center justify-end gap-3 p-3" >
                  <Action icon={<Trash size={18} />} onClick={() => {
                    deleteCategoria(categoria.id)
                  }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}