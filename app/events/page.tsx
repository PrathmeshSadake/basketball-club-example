import { getEvents } from "@/lib/luma-api";
import Link from "next/link";

export const metadata = {
  title: "Build Fast with AI",
  description: "Upcoming events from Build Fast with AI",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(({ event, api_id }) => (
          <div
            key={api_id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {event.cover_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={event.cover_url}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {new Date(event.start_at).toLocaleString(undefined, {
                  month: "long",
                  day: "numeric",
                  timeZone: "America/New_York",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

              <div className="flex justify-between mt-4">
                <Link
                  href={`/events/${event.api_id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                </Link>

                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
