import { ShoppingCart } from "lucide-react";
import { Navigation } from "./Navigation";

export function Navbar() {
  return (
    <nav className="bg-blue-600 flex justify-between px-8 py-4">
      <p></p>
      <div className="flex gap-3">
        <Navigation href="products" text="Produtos" icon={<ShoppingCart size={18} color="white" />} />
        <Navigation href="sales" text="Efetuar Venda" icon={<ShoppingCart size={18} color="white" />} />
      </div>
      <p></p>
    </nav>
  )
}