import { TProductResponse } from "@/@types/Product";
import { GET } from "@/app/products/api/route";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnHeader } from "./ColumnHeader";
import { Column } from "./Column";
import { Action } from "./Action";
import { Input } from "./Input";
import { SelectFilter } from "./SelectFilter";

interface TModalCarrinho {
  carrinho: TProductResponse[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  setCarrinho: Dispatch<SetStateAction<TProductResponse[]>>
}

export function ModalCarrinho({ carrinho, setCarrinho, setIsModalOpen }: TModalCarrinho) {

  const [products, setProducts] = useState<TProductResponse[]>([])
  const [filtredProducts, setFiltredProducts] = useState<TProductResponse[]>([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  const exit = () => setIsModalOpen(false)

  const addProdutoAoCarrinho = (produto: TProductResponse) => {

    if (!carrinho.find(produtoCarrinho => produtoCarrinho.id === produto.id)) {
      produto.quantidadeVenda = 1
      setCarrinho(prev => [...prev, produto])
    }
  }

  const getProdutos = async () => {
    try {
      const response = await GET()

      if (response.length === 200) {
        setProducts(response)
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getProdutos()
  }, [])

  useEffect(() => {
    setFiltredProducts(products.filter((product) => {
      return (
        (product.nome.toLowerCase().includes(search.toLowerCase()) ||
          product.codigo.toLowerCase().includes(search.toLowerCase())) &&
        product.categoria.nome.toLowerCase().includes(filter.toLowerCase())
      )
    }))
  }, [filter, search, products])

  return (
    <div onClick={e => setIsModalOpen(false)} className="fixed z-10 h-full w-full bg-black bg-opacity-50 flex justify-center items-center">

      <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-8 p-5 w-1/2 rounded-lg max-h-[90%] overflow-y-auto">

        <header className="flex justify-between items-center">
          <p className="font-bold text-2xl">Produtos</p>

          <X className="cursor-pointer" size={24} onClick={exit} />
        </header>

        <div className="
        flex justify-between items-center">
          <Input placeholder="Buscar produtos" onChange={e => setSearch(e.target.value)} />
          <SelectFilter filter={filter} setFilter={setFilter} />
        </div>

        <table className="w-full mt-6">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <ColumnHeader text={'Nome'} />
              <ColumnHeader text={'Quantidade'} />
              <ColumnHeader text={'Preço'} />
              <ColumnHeader text={'Categoria'} />
              <td>
              </td>
            </tr>
          </thead>
          <tbody>
            {filtredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                <Column text={product.nome} />
                <Column text={String(product.quantidade)} />
                <Column text={`R$${String(product.preco.toFixed(2))}`} />
                <Column text={product.categoria.nome} />
                <td className="h-full flex items-center justify-center gap-3 p-3" >
                  <Action icon={<Plus size={18} />} onClick={() => {
                    addProdutoAoCarrinho(product)
                  }} save />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}