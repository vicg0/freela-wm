import { TProductResponse } from "@/@types/Product";
import { GET } from "@/app/products/api/route";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnHeader } from "./ColumnHeader";
import { Column } from "./Column";
import { Action } from "./Action";
import { Button } from "./Button";

interface TModalCarrinho {
  carrinho: TProductResponse[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  setCarrinho: Dispatch<SetStateAction<TProductResponse[]>>
}

export function ModalCarrinho({ carrinho, setCarrinho, setIsModalOpen }: TModalCarrinho) {

    const [products, setProducts] = useState<TProductResponse[]>([])
  
  const exit = () => setIsModalOpen(false)

  const addProdutoAoCarrinho = (produto: TProductResponse) => {
    
    if(!carrinho.find(produtoCarrinho => produtoCarrinho.id === produto.id)) {
      produto.quantidadeVenda = 1
      setCarrinho(prev => [...prev, produto])
    }
  }

  const getProdutos = async () => {
      try {
        const response = await GET()
        
        if (response.length !== 204) {
          setProducts(response)
        }
      } catch (e) {
        console.log(e);
      }
    }

  useEffect(() => {
    getProdutos()
  }, [])

  return (
    <div onClick={e => setIsModalOpen(false)} className="fixed z-10 h-full w-full bg-black bg-opacity-50 flex justify-center items-center">

      <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-8 p-5 w-1/2 rounded-lg max-h-[90%] overflow-y-auto">

        <header className="flex justify-between items-center">
          <p className="font-bold text-2xl">Produtos</p>

          <X className="cursor-pointer" size={24} onClick={exit} />
        </header>

        <table className="w-full mt-6">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <ColumnHeader text={'Nome'} />
                <ColumnHeader text={'Quantidade'} />
                <ColumnHeader text={'Preço'} />
                <td>
                </td>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                  <Column text={product.nome} />
                  <Column text={String(product.quantidade)} />
                  <Column text={`R$${String(product.preco.toFixed(2))}`} />
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