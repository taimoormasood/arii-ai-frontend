import Image from "next/image";

import { EmailIcon, PhoneIcon } from "@/assets/icons";
import { girlAvatarImg } from "@/assets/images";
import { Owner } from "@/services/properties/types";

interface InvestorCardProps {
  data: Owner[];
}

const InvestorCard = ({ data }: InvestorCardProps) => {
  const owners = data;

  return (
    <div className="w-full  mx-auto">
      <h2 className="md:text-xl text-lg font-semibold my-4">Investor</h2>

      <div className="grid grid-cols-12 w-full gap-4">
        {owners.map((owner: Owner, index: number) => (
          <div
            key={owner.id}
            className="col-span-12 md:col-span-6 lg:col-span-4 px-6 py-3 rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex gap-3 items-center">
              <Image
                src={girlAvatarImg}
                alt="Investor Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-gray-800 font-semibold md:text-sm text-xs">
                  {owner.username}
                </h2>
                {owner.emergency_contact && (
                  <div className="flex items-center gap-x-2 md:text-sm text-xs mt-1">
                    <PhoneIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">
                      {owner.emergency_contact}
                    </span>
                  </div>
                )}
                {owner.email && (
                  <div className="flex items-center gap-x-2 md:text-sm text-xs mt-1">
                    <EmailIcon className="w-4 h-4 text-gray-600  flex-shrink-0 " />
                    <span className="text-gray-700 break-all">
                      {owner.email}
                    </span>
                  </div>
                )}
                <div className="md:text-sm text-xs text-gray-700 mt-1">
                  {owner.percentage}% Ownership
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorCard;
