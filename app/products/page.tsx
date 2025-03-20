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
import { SelectFilter } from "@/components/SelectFilter";
import { ModalCategoria } from "@/components/ModalCategoria";

export default function Home() {
  const [products, setProducts] = useState<TProductResponse[]>([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [filtredProducts, setFiltredProducts] = useState<TProductResponse[]>([])

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

  const [editProduct, setEditProduct] = useState<TProductResponse>()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const deleteProduct = async (product: TProductResponse) => {
    const response = await fetch(`http://localhost:8080/produtos/${product.id}`, {
      method: 'DELETE',
    })
    if (response.status === 204) {

      setProducts(
        products.filter(ev => ev.id !== product.id)
      )
    }
  }

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
    <>
      {isModalOpen && (
        <Modal product={editProduct} products={products} setProducts={setProducts} setIsModalOpen={setIsModalOpen} />
      )}

      {(filter === 'adicionar') && (
        <ModalCategoria setFilter={setFilter} />
      )}
      <div className="p-12">
        <div className="
        flex justify-between items-center">
          <Input placeholder="Buscar produtos" onChange={e => setSearch(e.target.value)} />
          <SelectFilter filter={filter} setFilter={setFilter} />
        </div>
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
              {filtredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-200 border-b-2 border-gray-200" >
                  <Column text={product.codigo} />
                  <Column text={product.nome} />
                  <Column text={product.quantidade} />
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
