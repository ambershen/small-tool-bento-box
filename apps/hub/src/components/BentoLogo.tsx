
export const BentoLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-5 h-5 grid grid-cols-2 gap-[2px] ${className}`}>
        {/* Left vertical block - Rice */}
        <div className="bg-current row-span-2 rounded-[1px]" />
        {/* Top right block - Main Dish */}
        <div className="border-[2px] border-current rounded-[1px]" />
        {/* Bottom right block - Side Dish */}
        <div className="bg-current rounded-[1px]" />
    </div>
  );
};
