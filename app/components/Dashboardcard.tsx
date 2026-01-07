import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;      
  value: number | string; 
  icon: ReactNode;   
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => {
  return (
    <div className='flex flex-col h-fit w-full bg-(--color-sidebar) hover:text-black hover:bg-[#f2edff] text-(--color-gray) text-[18px] font-semibold rounded-[18px] px-5 py-3 gap-3 shadow-lg hover:scale-105 transition'>
      <p>{title}</p>

      <div className='flex justify-between items-center'>
        {icon}
        <div className='text-black text-3xl'>{value}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
