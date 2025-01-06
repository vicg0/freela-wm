import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./Button";
import { Input } from "./Input";
import { TCategory, TProductRequest, TProductResponse } from "@/@types/Product";
import { NumericFormat } from "react-number-format";

interface TModal {
  product?: TProductResponse;
  products: TProductResponse[];
  setProducts: Dispatch<SetStateAction<TProductResponse[]>>,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  preco: z.string().min(1, "Preço deve ser no mínimo 1 real")
    .transform(val => val.replace('R$ ', '').replace('.', '').replace(',', '.'))
    .refine(val => Number(val) > 0, {
      message: 'Preço deve ser no mínimo R$1'
    }),
  quantidade: z.string().min(1, "Quantidade deve ser no mínimo 1")
    .transform(val => val.replace(',', '.'))
    .refine(val => Number(val) > 0, {
      message: 'Quantidade deve ser no mínimo 1'
    }),
  codigo: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string(),
});

export function Modal({ product = { id: undefined, nome: '', categoria: { id: 0, nome: '' }, codigo: '', preco: 0, quantidade: 0 }, products, setProducts, setIsModalOpen }: TModal) {
  const [categories, setCategories] = useState<TCategory[]>([])
  const [categoria, setCategoria] = useState(product.categoria.id)

  const getCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categorias')

      if (response.status !== 204) {
        const data = await response.json()

        setCategories(data)
        if(product.categoria.id === 0) setValue('categoria', String(data[0].id))
      }
    } catch (e) {
      console.log(e);

    }
  }

  useEffect(() => {
    getCategories()

  }, [])
  type TForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<TForm>({
    defaultValues: {
      nome: product.nome,
      categoria: String(product.categoria.id),
      codigo: product.codigo,
      preco: String(product.preco).replace('.', ','),
      quantidade: String(product.quantidade)
    },
    mode: 'onChange',
    resolver: zodResolver(schema)
  })

  const exit = () => setIsModalOpen(false)

  async function handleForm(data: TForm) {
    if (product.id) {
      const updateProduct: TProductRequest = {
        nome: data.nome,
        idCategoria: Number(data.categoria),
        codigo: data.codigo,
        preco: Number(data.preco),
        quantidade: Number(data.quantidade),
      }

      const response = await fetch(`http://localhost:8080/produtos/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateProduct),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      if (response.status === 200) {

        const data: TProductResponse = await response.json()

        const eventsUpdated = products.map(prev => {
          if (prev.id === data.id) {
            return data
          }
          else return prev
        })

        setProducts(eventsUpdated)
      }

    } else {

      const newProduct: TProductRequest = {
        nome: data.nome,
        codigo: data.codigo,
        preco: Number(data.preco),
        quantidade: Number(data.quantidade),
        idCategoria: Number(data.categoria),
      }

      const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      if (response.status === 200) {
        const data: TProductResponse = await response.json()
        setProducts(prev => [...prev, data])

      }

    }
    exit()

  }
  const ErrorMessage = ({ message }: { message: string }) => {
    return (
      <span className="text-red-500">{message}</span>
    )
  }

  return (
    <div onClick={e => setIsModalOpen(false)} className="absolute h-full w-full bg-black bg-opacity-50 flex justify-center items-center">
      <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-8 p-5 w-1/2 rounded-lg max-h-[90%] overflow-y-auto">
        <header className="flex justify-between items-center">
          <p className="font-bold text-2xl">Adicionar Produtos</p>

          <X className="cursor-pointer" size={24} onClick={exit} />
        </header>

        <form onSubmit={handleSubmit(handleForm)} className="flex flex-col gap-8">
          <div>
            <label htmlFor="nome"><span className="text-red-500">*</span> Nome</label>
            <Input id='nome' placeholder="Carlos" {...register('nome', { required: true })} error={errors.nome?.message ? true : false} />
            {errors.nome?.message && <ErrorMessage message={errors.nome.message} />}
          </div>

          <div>
            <label htmlFor="categoria"><span className="text-red-500">*</span> Categoria</label>
            <select value={categoria} onChange={e => {
              setValue('categoria', e.target.value)
              setCategoria(Number(e.target.value))
            }} id="categoria" className="w-full px-4 py-2 outline-none border-2 border-gray-300 rounded-lg focus:border-blue-400">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nome}</option>
              ))}
            </select>
            {errors.categoria?.message && <ErrorMessage message={errors.categoria.message} />}
          </div>

          <div className="flex flex-col">
            <label htmlFor="preco"><span className="text-red-500">*</span> Preço</label>

            <Controller
              name="preco"
              control={control}

              render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  getInputRef={ref}
                  data-error={errors.preco?.message ? true : false}
                  className="py-2 flex items-center gap-3 border-2 transition-all hover:border-blue-500 border-gray-300 focus-within:border-blue-500 rounded-md px-3 data-[error=true]:border-red-500"
                  {...rest}
                />
              )}
            />

            {/* <Input id="preco" placeholder="10.0" {...register('preco', { required: true })} error={errors.preco?.message ? true : false} /> */}
            {errors.preco?.message && <ErrorMessage message={errors.preco.message} />}
          </div>

          <div>
            <label htmlFor="codigo"><span className="text-red-500">*</span> Código</label>
            <Input id="codigo" placeholder="xxx-xxx-xxx" error={errors.codigo?.message ? true : false} {...register('codigo')} />
            {errors.codigo?.message && <ErrorMessage message={errors.codigo.message} />}
          </div>
          <div>
            <label htmlFor="quantidade"><span className="text-red-500">*</span> Quantidade</label>
            <Controller
              name="quantidade"
              control={control}

              render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                  getInputRef={ref}
                  decimalSeparator=","
                  data-error={errors.quantidade?.message ? true : false}
                  className="w-full py-2 flex items-center gap-3 border-2 transition-all hover:border-blue-500 border-gray-300 focus-within:border-blue-500 rounded-md px-3 data-[error=true]:border-red-500"
                  {...rest}
                />
              )}
            />
            {errors.quantidade?.message && <ErrorMessage message={errors.quantidade.message} />}
          </div>

          <Button type="submit" text="Salvar" className="bg-blue-400 text-white py-3 rounded-md sticky bottom-0" />
        </form>
      </div>
    </div>
  )
}