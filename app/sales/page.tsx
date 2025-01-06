'use client'

import { TProductResponse } from "@/@types/Product"
import { Action } from "@/components/Action"
import { Button } from "@/components/Button"
import { Column } from "@/components/Column"
import { ColumnHeader } from "@/components/ColumnHeader"
import { Input } from "@/components/Input"
import { ModalCarrinho } from "@/components/ModalCarrinho"
import { Plus, Trash } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"

export default function Sales() {
  const [carrinho, setCarrinho] = useState<TProductResponse[]>([])
  const [total, setTotal] = useState(0)
  const [cpf, setCpf] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteProduct = async (product: TProductResponse) => {

      setCarrinho(
        carrinho.filter(ev => ev.id !== product.id)
      )
  }

  const mudarQuantidade = (produto: TProductResponse, e: ChangeEvent<HTMLInputElement>) => {
    produto.quantidadeVenda = Number(e.target.value)
    
    const eventsUpdated = carrinho.map(prev => {
      if (prev.id === produto.id) {
        return produto
      }
      else return prev
    })


    setCarrinho(eventsUpdated)
  }

  const vender = async () => {

    const venda = {
      cpf: cpf ? cpf : null,
      produtos: []
    }
    
    carrinho.map(produto => {
      venda.produtos.push({
        codigo: produto.codigo,
        quantidade: produto.quantidadeVenda
      })
    })

    try {
      const response = await fetch('http://localhost:8080/vendas', {
        method: 'POST',
        body: JSON.stringify(venda),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        setCarrinho([])
      }

    } catch (e) {
      console.log(e);
      
    }

  }

  useEffect(() => {
    setTotal(0)
    carrinho.map(produto => {
      setTotal(prev => prev + (produto.preco * produto.quantidadeVenda))
    })
  }, [carrinho])

  return (
    <>
      {isModalOpen && (
        <ModalCarrinho setCarrinho={setCarrinho} carrinho={carrinho} setIsModalOpen={setIsModalOpen} />
      )}
      <div className="p-12 flex flex-col gap-3">
        <div>
          <Input value={cpf} placeholder="CPF" onChange={e => setCpf(e.target.value)} />
        </div>
        <div className="p-6 flex-col shadow-xl">
          <h1 className="font-bold text-2xl">Carrinho</h1>

          <table className="w-full mt-6">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <ColumnHeader text={'Código'} />
                <ColumnHeader text={'Nome'} />
                <ColumnHeader text={'Quantidade'} />
                <ColumnHeader text={'Categoria'} />
                <ColumnHeader text={'Preço'} />
                <td className="flex h-full items-center justify-center py-3">
                  <Button onClick={() => {
                    setIsModalOpen(true)
                  }} text="Adicionar" className="h-full bg-blue-400 px-4 py-2 rounded-md text-white flex gap-3" icon={<Plus size={24} />} />
                </td>
              </tr>
            </thead>
            <tbody>
              {carrinho.map(product => (
                <tr key={product.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                  <Column text={product.codigo} />
                  <Column text={product.nome} />
                  <td className="py-4 px-2">
                    <input onChange={e => mudarQuantidade(product, e)} value={product.quantidadeVenda} className="max-w-max text-right" type="number" min={1} max={product.quantidade} />
                    /
                    {product.quantidade}
                  {/* <Column text={String(product.quantidade)} /> */}
                  </td>
                  <Column text={product.categoria.nome} />
                  <Column text={`R$${String(product.preco.toFixed(2))}`} />
                  <td className="h-full flex items-center justify-center gap-3 p-3" >
                    <Action icon={<Trash size={18} />} onClick={() => deleteProduct(product)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between text-xl"><p>Total:</p> R${total.toFixed(2)}</div>

        </div>

        {carrinho.length > 0 && (
          <div className="bg-gray-200 fixed bottom-0 left-0 w-full flex justify-center gap-5 py-3">
          <Button onClick={() => {setCarrinho([])}} text="Cancelar" className="h-full bg-red-500 px-4 py-2 rounded-md text-white flex gap-3" />
          <Button onClick={vender} text="Salvar" className="h-full bg-blue-400 px-4 py-2 rounded-md text-white flex gap-3" />
        </div>
        )}
      </div>
    </>
  )
}