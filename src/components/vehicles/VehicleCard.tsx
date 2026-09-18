import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "./vehicles-data";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-white">
      <div className="relative h-[190px] w-full">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(min-width: 1024px) 356px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 px-[10px] pb-3 pt-3">
        <h3 className="text-[20px] font-black uppercase leading-[20px] text-[#1e1e1e]">
          {vehicle.name}
        </h3>
        <div className="flex items-center gap-6">
          <Link
            // href={`/vehicles/${vehicle.id}`}
            href={`/vehicles/caris`}
            className="flex items-center gap-2 text-[16px] leading-[normal] text-[#1e1e1e]"
          >
            Discover more
            <Image src="/icons/icon-arrow-right.svg" alt="" width={16} height={16} />
          </Link>
          <Link
            href={`/vehicles/${vehicle.id}/order`}
            className="flex items-center gap-2 text-[16px] leading-[normal] text-[#1e1e1e]"
          >
            Order Now
            <Image src="/icons/icon-arrow-right.svg" alt="" width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
