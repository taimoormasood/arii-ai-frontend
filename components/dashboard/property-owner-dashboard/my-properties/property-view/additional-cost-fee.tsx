import { formatText } from "@/helpers";
import { CostFeeCategory } from "@/services/properties/types";

const AdditionalCostFee = ({ data }: { data: CostFeeCategory[] }) => {
  const flatFees = data?.flatMap((category) => category.fees);

  return (
    <div className="w-full  mx-auto md:py-6 py-2">
      <h2 className="md:py-6 py-2 md:text-xl text-lg font-semibold pb-2">
        Additional Cost & Fee
      </h2>

      <div className="grid grid-cols-12 gap-4 w-full">
        {flatFees?.map((fee, index) => (
          <div
            key={index}
            className="lg:col-span-4 col-span-12 md:px-6 px-2 md:py-3 py-2 rounded-lg w-full border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 md:text-sm text-xs">Fee Name</span>
              <h3 className="font-medium text-gray-800 md:text-sm text-xs">
                {formatText(fee.fee_name)}
              </h3>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 md:text-sm text-xs">Amount</span>
              <h3 className="text-gray-700 md:text-sm text-xs">
                ${formatText(fee.fee_amount)}
              </h3>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 md:text-sm text-xs">
                Frequency
              </span>
              <h3 className="text-gray-700 md:text-sm text-xs">
                {formatText(fee.payment_frequency)}
              </h3>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 md:text-sm text-xs">
                Is this fee required?
              </span>
              <h3 className="text-gray-700 md:text-sm text-xs">
                {formatText(fee.is_required)}
              </h3>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 md:text-sm text-xs">
                Is the fee refundable?
              </span>
              <h3 className="text-gray-700 md:text-sm text-xs">
                {formatText(fee.refundable_status)}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalCostFee;
