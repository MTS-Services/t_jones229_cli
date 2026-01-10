import Container from "@/components/common/Container";
import Image from "next/image";

const KeyBookingDetails = () => {
  return (
    <Container className="bg-white">
      {/* Top Banner Section */}
      <header className="bg-[#f8f9fa] py-10 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Your Fishing Trip is Confirmed!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Thanks for booking with us! We&apos;ve sent the full details to your
            email at{" "}
            <a
              href="mailto:email@example.com"
              className="text-blue-600 underline underline-offset-2"
            >
              email@example.com
            </a>
            . If you don&apos;t see it, check your spam folder or contact us.
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid md:grid-cols-2 grid-cols-1 lg:mt-10 md:mt-8 mt-10">
        {/* Left Column: Details */}
        <div className="col-span-1 order-2 md:order-1 flex flex-col gap-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">Key booking details</h2>
            <div className="space-y-1 text-gray-500">
              <p>
                <span className="font-semibold text-gray-700">Trip Name:</span>{" "}
                Trolling and Dolphin Trip.
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Date & Time:
                </span>{" "}
                12th September 2025, 4 PM.
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Meeting Point:
                </span>{" "}
                Marina Bay, Florida.
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Participants:
                </span>{" "}
                4 people.
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Booking Reference Number:
                </span>{" "}
                #12345.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">What next?</h3>
            <p className="text-gray-500">
              Arrive 15 minutes early at Marina Bay, Florida.
              <br />
              Bring sunscreen, snacks, and any fishing gear you prefer.
            </p>
          </section>

          <div className="pt-4">
            <button className="bg-[#ffb347] hover:bg-[#ffa022] text-white font-medium py-3 px-8 rounded-full transition-colors shadow-sm">
              Explore more trips
            </button>
          </div>
        </div>

        {/* Right Column: Next.js Optimized Image */}
        <div className="col-span-1 order-1 md:order-2 relative h-[400px]">
          <Image
            src="/image.jpg"
            alt="Aerial view of fishing boat"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </main>
    </Container>
  );
};

export default KeyBookingDetails;
