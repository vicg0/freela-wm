export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <span className="text-red-500">{message}</span>
  )
}