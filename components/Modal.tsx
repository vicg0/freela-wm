import { TProduct } from "@/app/products/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./Button";
import { Input } from "./Input";

interface TModal {
  product?: TProduct;
  products: TProduct[];
  setProducts: Dispatch<SetStateAction<TProduct[]>>,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  preco: z.number().min(1, "Preço deve ser no mínimo 1 real"),
  quantidade: z.number().min(1, "Quantidade deve ser no mínimo 1"),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string().min(1),
});

export function Modal({ product = { nome: '', categoria: '', descrição: '', preco: 0, quantidade: 0 }, products, setProducts, setIsModalOpen }: TModal) {

  type TForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TForm>({
    mode: 'onSubmit',
    resolver: zodResolver(schema)
  })

  register('nome', { value: product.nome })
  register('descricao', { value: product.descrição })
  register('categoria', { value: product.categoria })
  register('preco', { value: product.preco })
  register('quantidade', { value: product.quantidade })

  const exit = () => setIsModalOpen(false)

  function handleForm(data: TForm) {

    if (product.id) {
      const updateProduct: TProduct = {
        id: product.id,
        nome: data.nome,
        categoria: data.categoria,
        descrição: data.descricao,
        preco: data.preco,
        quantidade: data.quantidade,
      }
      const eventsUpdated = products.map(prev => {
        if (prev === product) {
          return updateProduct
        }
        else return prev
      })

      setProducts(eventsUpdated)

    } else {

      const newProduct: TProduct = {
        id: Math.random(),
        nome: data.nome,
        categoria: data.categoria,
        descrição: data.descricao,
        preco: data.preco,
        quantidade: data.quantidade,
      }

      setProducts(prev => [...prev, newProduct])
    }
    exit()

  }
  const ErrorMessage = ({ message }: { message: string }) => {
    return (
      <span className="text-red-500">{message}</span>
    )
  }

  return (
    <div className="absolute h-full w-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white flex flex-col gap-8 p-5 w-1/2 rounded-lg max-h-[90%] overflow-y-auto">
        <header className="flex justify-between items-center">
          <p className="font-bold text-2xl">Adicionar Produtos</p>

          <X size={24} onClick={exit} />
        </header>

        <form onSubmit={handleSubmit(handleForm)} className="flex flex-col gap-8">
          <div>
            <label htmlFor="nome"><span className="text-red-500">*</span> Nome</label>
            <Input id='nome' placeholder="Victor Boliviano" {...register('nome', { required: true })} error={errors.nome?.message ? true : false} />
            {errors.nome?.message && <ErrorMessage message={errors.nome.message} />}
          </div>

          <div>
            <label htmlFor="categoria"><span className="text-red-500">*</span> Categoria</label>
            <select {...register('categoria')} id="categoria" className="w-full px-4 py-2 outline-none border-2 border-gray-300 rounded-lg focus:border-blue-400">
              <option value="Notebooks">Notebooks</option>
            </select>
            {errors.categoria?.message && <ErrorMessage message={errors.categoria.message} />}
          </div>

          <div>
            <label htmlFor="preco"><span className="text-red-500">*</span> Preço</label>

            <Input id="preco" type="number" placeholder="10.0" {...register('preco', { valueAsNumber: true, required: true })} error={errors.preco?.message ? true : false} />
            {errors.preco?.message && <ErrorMessage message={errors.preco.message} />}
          </div>

          <div>
            <label htmlFor="descricao"><span className="text-red-500">*</span> Descrição</label>
            <Input id="descricao" placeholder="Notebook Air M1" error={errors.descricao?.message ? true : false} {...register('descricao')} />
            {errors.descricao?.message && <ErrorMessage message={errors.descricao.message} />}
          </div>
          <div>
            <label htmlFor="quantidade"><span className="text-red-500">*</span> Quantidade</label>
            <Input id="quantidade" type="number" placeholder="0" error={errors.quantidade?.message ? true : false} {...register('quantidade', { valueAsNumber: true, required: true })} />
            {errors.quantidade?.message && <ErrorMessage message={errors.quantidade.message} />}
          </div>

          <Button type="submit" text="Salvar" className="bg-blue-400 text-white py-3 rounded-md sticky bottom-0" />
        </form>
      </div>
    </div>
  )
}