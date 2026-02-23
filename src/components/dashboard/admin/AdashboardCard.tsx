import Link from "next/link";

// Reusable Card component
type AdashboardCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  link: string;
};

export default function AdashboardCard({
  title,
  value,
  icon,
  link,
}: AdashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md w-full border border-gray-100 h-[144px] p-4">
      <Link href={link} className="block h-full">
        <div className="h-full">
          <div className="flex items-center justify-between h-[47px] mb-2">
            <span className="text-sm font-normal text-black">{title}</span>
            {icon && <div className="flex-shrink-0">{icon}</div>}
          </div>
          <div className="text-[40px] font-bold text-primary pt-1">{value}</div>
        </div>
      </Link>
    </div>
  );
}
