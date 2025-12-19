import { ReactNode } from "react";

export interface EmptyContentProps {
  title:   string;
  message: string;
  icon:    any
}
export default function EmptyContent({ title, message, icon }: EmptyContentProps) {

  const Icon = icon;

  return (
    <div className="text-center py-20">
      <div className="relative inline-block mb-6">
        <Icon className="w-20 h-20 text-purple-400 mx-auto opacity-50" />
        <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20"></div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
}
