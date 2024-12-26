export function Action({ icon, onClick, edit = false }: { icon: React.ReactNode, onClick: () => void, edit?: boolean }) {
  return (
    <div data-edit={edit} className="rounded-full p-3 data-[edit=true]:bg-yellow-500 text-white bg-red-500" onClick={onClick}>{icon}</div>
  )
}