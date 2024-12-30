export function Action({ icon, onClick, edit = false, save = false }: { icon: React.ReactNode, onClick: () => void, edit?: boolean, save?: boolean}) {
  return (
    <div data-save={save} data-edit={edit} className="cursor-pointer rounded-full p-3 data-[save=true]:bg-green-500 data-[edit=true]:bg-yellow-500 text-white bg-red-500" onClick={onClick}>{icon}</div>
  )
}