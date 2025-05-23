import { EventList } from "@/components/EventList";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-4 max-w-[600px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Build Fast with AI
                </h2>

                <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  We are a community of AI enthusiasts who meet regularly to
                  learn and socialize.
                </p>

                <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  This website shows how you can use the Luma API on your
                  website.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold sm:text-xl md:text-3xl">
                    Upcoming Events
                  </h2>
                  <a
                    href="/events"
                    className="text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                  >
                    View All Events
                  </a>
                </div>

                <EventList />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
