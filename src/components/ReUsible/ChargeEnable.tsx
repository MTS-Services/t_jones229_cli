"use client";

import { useGetChargeEnableQuery } from "@/redux/api/bookingApi";
import Link from "next/link";

export default function ChargeEnable() {
  const { data, isLoading, isError, error, isFetching } =
    useGetChargeEnableQuery({});
  let content;

  if (isLoading || isFetching) {
    content = <div>Generating stripe onboarding link...</div>;
  }

  if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  }

  if (data && !isLoading && !isFetching && !isError) {
    content = (
      <Link
        href={`${data.data}`}
        target="_blank"
        className="mt-2 text-sm text-blue-600 font-semibold hover:underline"
      >
        Click here to enable charging
      </Link>
    );
  }

  return (
    <div>
      <div className="mt-5">
        <div className=" border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-lg p-4">
          <p className="text-base font-medium">
            Your account is not currently charge-enabled by stripe.
          </p>

          {content}
        </div>
      </div>
    </div>
  );
}
