'use client'

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { GET } from "./api/route";
import { TProductResponse } from "@/@types/Product";
import { ColumnHeader } from "@/components/ColumnHeader";
import { Column } from "@/components/Column";
import { Action } from "@/components/Action";

export default function Home() {
  const [products, setProducts] = useState<TProductResponse[]>([])
  console.log(products);
  
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

  const [editProduct, setEditProduct] = useState<TProductResponse>()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const deleteProduct = async (product: TProductResponse) => {
    const response = await fetch(`http://localhost:8080/produtos/${product.id}`, {
      method: 'DELETE',
    })
    if(response.status === 204) {

      setProducts(
        products.filter(ev => ev.id !== product.id)
      )
    }
  }

  // const Delete = ({ delete, icon }: { icon: React.ReactNode, delete: boolean }) => {
  //   return (
  //       <div className="p-3 bg-" data-delete={delete}></div>
  //   )
  // }

  return (
    <>
      {isModalOpen && (
        <Modal product={editProduct} products={products} setProducts={setProducts} setIsModalOpen={setIsModalOpen} />
      )}
      <div className="p-12">
        {/* <div>
          <Input placeholder="Buscar produtos" />
        </div> */}
        <div className="p-6 flex-col shadow-xl">
          <h1 className="font-bold text-2xl">Produtos em estoque</h1>

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
                    setEditProduct(undefined)
                    setIsModalOpen(true)
                  }} text="Adicionar" className="h-full bg-blue-400 px-4 py-2 rounded-md text-white flex gap-3" icon={<Plus size={24} />} />
                </td>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                  <Column text={product.codigo} />
                  <Column text={product.nome} />
                  <Column text={String(product.quantidade)} />
                  <Column text={product.categoria.nome} />
                  <Column text={`R$${String(product.preco.toFixed(2))}`} />
                  <td className="h-full flex items-center justify-center gap-3 p-3" >
                    <Action edit icon={<PencilLine size={18} />} onClick={() => {
                      setEditProduct(product)
                      setIsModalOpen(true)
                    }} />
                    <Action icon={<Trash size={18} />} onClick={() => deleteProduct(product)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
