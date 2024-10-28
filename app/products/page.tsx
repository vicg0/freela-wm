'use client'

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/Navbar";
import { PencilLine, Plus, Trash } from "lucide-react";
import { useState } from "react";

export type TProduct = {
  id: number | undefined;
  nome: string;
  preco: number;
  quantidade: number;
  descrição: string;
  categoria: string;
}

export default function Home() {
  const [products, setProducts] = useState<TProduct[]>([{
    id: Math.random(),
    nome: 'Notebook',
    categoria: 'Notebooks',
    preco: 1500,
    descrição: "Note",
    quantidade: 2
  }])

  const [editProduct, setEditProduct] = useState<TProduct>()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const Column = ({ text }: { text: any }) => {
    return <td className="py-4 px-2">{text}</td>
  }

  const ColumnHeader = ({ text }: { text: any }) => {
    return <td className="text-left font-bold py-4 px-2">{text}</td>
  }

  const deleteProduct = (product: TProduct) => {
    setProducts(
      products.filter(ev => ev.id !== product.id)
    )
  }

  function Action({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) {
    return (
      <div className="rounded-full p-3 bg-red-500" onClick={onClick}>{icon}</div>
    )
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
        <div className="p-6 flex-col shadow-xl">
          <h1 className="font-bold text-2xl">Produtos em estoque</h1>

          <table className="w-full mt-6">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <ColumnHeader text={'Nome'} />
                <ColumnHeader text={'Quantidade'} />
                <ColumnHeader text={'Preço'} />
                <ColumnHeader text={'Descrição'} />
                <ColumnHeader text={'Categoria'} />
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
                  <Column text={product.nome} />
                  <Column text={product.quantidade} />
                  <Column text={product.preco} />
                  <Column text={product.descrição} />
                  <Column text={product.categoria} />
                  <td className="h-full flex items-center justify-center gap-3 p-3" >
                    <Action icon={<PencilLine size={18} />} onClick={() => {
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
