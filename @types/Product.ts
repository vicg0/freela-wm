export type TProductRequest = {
  id?: number;
  nome: string;
  preco: number;
  quantidade: number;
  codigo: string;
  idCategoria: number;
}

export type TProductResponse = {
  id?: number;
  nome: string;
  preco: number;
  quantidade: number;
  codigo: string;
  categoria: TCategory;
}

export type TCategory = {
  id: number,
  nome: string
}

export type TOption = {
  label: string,
  value: string
}