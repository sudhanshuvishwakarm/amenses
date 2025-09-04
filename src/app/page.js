import Image from "next/image";
import { Calendar, Users, CheckCircle } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      title: "Easy Scheduling",
      description: "Create events and propose multiple time slots",
    },
    {
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      title: "Group Polling",
      description: "Let participants vote on their preferred times",
    },
    {
      icon: CheckCircle,
      gradient: "from-blue-500 to-blue-600",
      title: "Quick Decisions",
      description: "Find the best time that works for everyone",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <section className="w-full max-w-4xl text-center">
        {/* Logo Section */}
        <div className="flex justify-center mb-5">
          <Image
            src="/images/logo.png"
            alt="Event Planning Logo"
            width={180}
            height={70}
            className="object-contain bg-black p-2"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Plan events. Poll dates.
            <span className="block">Decide faster.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Create events, invite participants, and collect votes on the best
            time.
            <span className="block mt-2 text-sm sm:text-base text-gray-500">
              Making group scheduling simple and efficient.
            </span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
          <a
            href="/login"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[140px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative">Log in</span>
          </a>

          <a
            href="/signup"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[140px]"
          >
            <span className="absolute inset-0 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative">Sign up</span>
          </a>
        </div>

        {/* Features Preview */}
        <div className="mt-16  grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
