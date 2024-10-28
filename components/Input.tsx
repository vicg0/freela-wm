import React, { InputHTMLAttributes } from "react";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
  icon?: React.ReactNode,
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, TInput>(({ error = false, icon, ...rest }, ref) => {
  return (
    <div className="flex items-center gap-3 border-2 transition-all hover:border-blue-500 border-gray-300 focus-within:border-blue-500 rounded-md px-3 data-[error=true]:border-red-500" data-error={error} >
      {icon}
      <input {...rest} ref={ref} className="w-full outline-none py-2" />
    </div>
  )
})

Input.displayName = 'Input'
export { Input }