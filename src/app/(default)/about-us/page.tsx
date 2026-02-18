import Container from "@/components/common/Container";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#0f5d9e] text-white py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl text-gray-200 md:text-5xl font-bold mb-6">
              About FishingTripper
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting anglers, sharing adventures, and making fishing
              accessible to everyone
            </p>
          </div>
        </Container>
      </div>

      {/* Our Story Section */}
      <Container>
        <div className="">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f5d9e] mb-8 text-center italic">
              Our Story
            </h2>

            <div className="">
              <div className="bg-white space-y-8 text-gray-500 text-lg rounded-xl p-8 shadow-sm border border-gray-200 leading-relaxed">
                <p className="">
                  Fishing Tripper started with a simple problem I wanted to
                  solve for myself.
                </p>

                <p className="">
                  I'm lucky enough to travel a lot for my job as a pilot, and
                  whenever I'm away, I love the idea of going fishing. The
                  problem is that chartering a boat is expensive and doing it
                  regularly isn't realistic.
                </p>

                <p className="">
                  Most of the time, I don't need the whole boat to myself. I'd
                  be more than happy to share a trip with other anglers and
                  split the cost. If that was easy to do, I'd go fishing every
                  week.
                </p>

                <p className="">That's what led to Fishing Tripper.</p>

                <p className="">
                  I wanted to create a platform that allows anglers to book
                  hassle-free shared charters, making great fishing more
                  affordable and social, while also having the flexibility to
                  book private charters for those who want the whole boat to
                  themselves.
                </p>

                <p className="">
                  At the same time, FishingTripper is designed to give charter
                  operators a simple, reliable booking system that works for
                  both shared and private trips - without the admin headaches.
                </p>

                <p className="">
                  FishingTripper is built around fairness, flexibility, and
                  trust, with the goal of making it easier for anglers to get on
                  the water and easier for captains to run their businesses.
                </p>

                <div className="text-center bg-[#0f5d9e] text-white rounded-lg p-6">
                  <div className="text-xl font-bold text-white mb-2">
                    Tight Lines!
                  </div>
                  <div className="text-lg">
                    <strong>Tom</strong>
                    <br />
                    <span className="text-white">Founder, Fishing Tripper</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* CTA Section */}
      <div className="bg-[#0f5d9e] text-white md:py-16 py-14">
        <Container>
          <div className=" max-w-4xl mx-auto">
            <p className="text-gray-300 capitalize font-bold text-center text-4xl mb-8">
              Join thousands of anglers who've found their perfect fishing trips
              through FishingTripper.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-white hover:bg-gray-200 text-[#0f5d9e] px-8 py-3 rounded-lg font-semibold transition duration-200">
                  Browse Fishing Trips
                </button>
              </Link>
              <Link href="/">
                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
                  List Your Charter
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
