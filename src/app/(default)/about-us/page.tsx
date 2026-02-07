import Image from "next/image";
import Container from "@/components/common/Container";
import { Scale, ShieldCheck, Shuffle } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#0f5d9e] text-white py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About FishingTripper
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting anglers, sharing adventures, and making fishing trips
              accessible to everyone
            </p>
          </div>
        </Container>
      </div>

      {/* Our Story Section */}
      <Container>
        <div className="">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl text-gray-600 italic text-center mb-8">
                "Every great adventure starts with a simple idea..."
              </p>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <p className="mb-6">
                  Hey there! I'm Tom, and like many of you, I'm completely
                  hooked on fishing. When I'm not up in the cockpit flying
                  planes, you'll find me dreaming about my next fishing
                  adventure or planning trips to chase that perfect catch.
                </p>

                <p className="mb-6">
                  But here's the thing that always frustrated me (and I bet it
                  frustrates you too) — charter fishing was either crazy
                  expensive or just plain impractical. Want to book a private
                  charter? That'll be $1,500 for the day, thank you very much.
                  And honestly, most of us don't need an entire boat to
                  ourselves. Half the fun of fishing is sharing stories,
                  learning from other anglers, and maybe even making some new
                  fishing buddies along the way.
                </p>

                <p className="mb-6">
                  So there I was, a pilot who loves to fish, thinking there had
                  to be a better way. Why couldn't anglers easily find others
                  who wanted to share a trip? Why couldn't we split the costs
                  and still have an amazing time on the water? And why did
                  charter operators have to deal with endless phone calls,
                  booking confusion, and administrative headaches?
                </p>

                <p className="mb-6">
                  That's when FishingTripper was born. I wanted to create
                  something simple, fair, and flexible — a platform where fellow
                  anglers could easily book shared charters, connect with
                  like-minded fishing enthusiasts, and split the costs without
                  the hassle. And if you want that private charter experience?
                  No problem! We've got you covered there too.
                </p>

                <p className="mb-6">
                  But it's not just about the anglers. I've met so many
                  incredible charter operators who are passionate about what
                  they do but were drowning in booking admin. FishingTripper
                  gives them a simple, reliable system that lets them focus on
                  what they do best — providing unforgettable fishing
                  experiences.
                </p>

                <div className="bg-blue-50 rounded-lg p-6 my-8">
                  <h3 className="text-xl text-center font-semibold text-blue-900 mb-4">
                    What We Believe In
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Fairness */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-900">Fairness</h4>
                      <p className="text-sm text-blue-700">
                        Everyone deserves access to amazing fishing experiences
                        without breaking the bank
                      </p>
                    </div>

                    {/* Flexibility */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shuffle className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-900">
                        Flexibility
                      </h4>
                      <p className="text-sm text-blue-700">
                        Share a trip, book privately, or join others — your
                        choice, your way
                      </p>
                    </div>

                    {/* Trust */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-900">Trust</h4>
                      <p className="text-sm text-blue-700">
                        Safe, secure booking with verified operators and fellow
                        anglers
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-6">
                  Today, FishingTripper connects thousands of anglers with
                  incredible fishing adventures. Whether you're a seasoned pro
                  looking to explore new waters or someone just getting started
                  in the sport we all love, there's a place for you here.
                </p>

                <p className="mb-8">
                  Every trip booked, every connection made, and every fish
                  caught through our platform reminds me why I started this
                  journey. We're not just booking fishing trips — we're building
                  a community of people who share the same passion for getting
                  out on the water and experiencing the thrill of the catch.
                </p>

                <div className="text-center bg-[#0f5d9e] text-white rounded-lg p-6">
                  <p className="text-lg font-medium mb-2">
                    Ready to join our fishing community?
                  </p>
                  <p className="mb-4">
                    Book your next adventure, meet fellow anglers, and create
                    memories that'll last a lifetime.
                  </p>
                  <div className="text-xl font-bold text-white">
                    Tight Lines!
                  </div>
                  <div className="text-lg mt-2">
                    <strong>Tom</strong>
                    <br />
                    <span className="text-white">Founder, FishingTripper</span>
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
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Cast Your Line?
            </h3>
            <p className="text-gray-300 mb-8">
              Join thousands of anglers who've found their perfect fishing trips
              through FishingTripper.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
                Browse Fishing Trips
              </button>
              <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
                List Your Charter
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
