import { Star } from "lucide-react";

export function Stars() {
  return (
    <div className="flex w-full items-center justify-center gap-1">
      <Star size={16} fill="#defa2c" />
      <Star size={16} fill="#defa2c" />
      <Star size={16} fill="#defa2c" />
      <Star size={16} className="text-[#defa2c]" />
    </div>
  );
}
