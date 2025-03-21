import { TCategory, TOption } from "@/@types/Product";
import { Select } from "@radix-ui/themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./Button";
import { Plus, Undo2 } from "lucide-react";

type TOptionGroup = {
  label?: string;
  options: TOption[]
};

interface SelectProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function SelectFilter({ filter, setFilter }: SelectProps) {
  const [categories, setCategories] = useState<TOptionGroup[]>([])

  const getCategories = async () => {

    try {
      const response = await fetch('http://localhost:8080/categorias')

      if (response.status === 200) {
        const data = await response.json()

        const options: TOption[] = []

        await data.map((item: TCategory) => {
          options.push({
            label: item.nome,
            value: String(item.id)
          })
        })

        setCategories([{
          label: 'Categorias',
          options: data.map((item: TCategory) => {
            return {
              label: item.nome,
              value: String(item.id)
            }
          })
        }])

      }
    } catch (e) {
      console.log(e);

    }
  }

  useEffect(() => {
    getCategories()
  }, [filter])

  return (
    <div className="flex gap-2 items-center">
      

      <Select.Root defaultValue={filter} onValueChange={setFilter} value={filter}>
        <Select.Trigger radius="medium"></Select.Trigger>
        <Select.Content className="z-0" variant="soft">
          {categories.map((option, index) => (
            <Select.Group key={index}>
              <Select.Label>{option.label}</Select.Label>
              {option.options.map(item => (
                <Select.Item key={item.value} value={item.label}>{item.label}</Select.Item>
              ))}
            </Select.Group>
          ))}

          <Select.Item className="bg-blue-400 rounded-md" value="adicionar">

          <div className="z-0 flex items-center gap-1  p-1 text-sm justify-center cursor-pointer text-white">
            <Plus size={16} />
            <p>Adicione uma categoria</p>
          </div>
          </Select.Item>

        </Select.Content>
      </Select.Root>

      {filter !== '' && (

        <Button onClick={(e) => setFilter('')} icon={<Undo2 size={20} />} className="bg-yellow-400 rounded-md px-3 py-2" />
      )}

    </div>
  )
}