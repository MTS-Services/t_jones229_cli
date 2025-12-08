import Link from "next/link";

// Reusable Card component
type DashboardCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  link: string;
};

export default function AdashboardCard({
  title,
  value,
  icon,
  link
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md w-full h-[144px] admindas-shadow">
      <Link href={link}>
      <div className="flex items-center justify-between text-sm font-semibold text-white bg-[#0A237C] w-full h-[47px] rounded-md px-3 py-1 mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      </div>
      <div className="text-[40px] font-bold  text-primary pl-5 pt-1">
        {value}
      </div>
      </Link>
    </div>
  );
}
