import { TCategory } from "@/@types/Product";
import { Plus, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnHeader } from "./ColumnHeader";
import { Column } from "./Column";
import { Action } from "./Action";
import { Input } from "./Input";
import { Button } from "./Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "./ErrorMessage";

interface TModalCarrinho {
  setFilter: Dispatch<SetStateAction<string>>;
}

const schema = z.object({
  categoria: z.string().min(1, "Insira um nome a categoria")
})

export function ModalCategoria({ setFilter }: TModalCarrinho) {

  const [categorias, setCategorias] = useState<TCategory[]>([])

  type TForm = z.infer<typeof schema>

  const { 
    register,
    handleSubmit,
    formState: { errors }
   } = useForm<TForm>({
    mode: 'onSubmit',
    resolver: zodResolver(schema)
  })

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

  const criarCategoria = async ({ categoria }: TForm) => {
    try {
      const response = await fetch('http://localhost:8080/categorias', {
        method: 'POST',
        body: JSON.stringify({
          nome: categoria
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

        <form onSubmit={handleSubmit(criarCategoria)} className="flex items-center justify-between">
          <div className="flex flex-col">
          <Input {...register('categoria')} placeholder="Nome da categoria" error={errors.categoria?.message ? true : false} />
          {errors.categoria?.message && <ErrorMessage message={errors.categoria.message} />}

          </div>
          <Button type="submit" text="Adicionar" className="h-full bg-green-500 px-4 py-2 rounded-md text-white flex gap-3" icon={<Plus size={24} />} />
        </form>

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