import { TProductResponse } from "@/@types/Product";

export async function GET(): Promise<TProductResponse[]> {
  const response = await fetch("http://localhost:8080/produtos", {
  })

  const data = await response.json()

  return data
}