import { getEventById, getEventParticipants } from "@/lib/luma-api";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventById(params.id);
  return {
    title: `${event.name} | NYC Basketball Club`,
    description: event.description || "Event details for NYC Basketball Club",
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventById(params.id);
  const participants = await getEventParticipants(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 md:mt-0 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Register for Event
          </a>
        </div>

        {event.cover_url && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            <img
              src={event.cover_url}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-3">Event Details</h2>
            <div className="prose max-w-none dark:prose-invert">
              {event.description ? (
                <div dangerouslySetInnerHTML={{ __html: event.description }} />
              ) : (
                <p>No description available for this event.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Date & Time</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(event.start_at).toLocaleString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "America/New_York",
                })}
              </p>
              {event.end_at && (
                <p className="text-gray-700 dark:text-gray-300">
                  Until{" "}
                  {new Date(event.end_at).toLocaleString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "America/New_York",
                  })}
                </p>
              )}
            </div>

            {event.location && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Location</h2>
                <p className="font-medium">{event.location.name}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {event.location.address}
                </p>
              </div>
            )}

            {event.hosts && event.hosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Hosts</h2>
                <ul className="space-y-2">
                  {event.hosts.map((host, index) => (
                    <li key={index} className="flex items-center">
                      {host.avatar_url && (
                        <img
                          src={host.avatar_url}
                          alt={host.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      )}
                      <span>{host.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          Participants ({participants.length})
        </h2>

        {participants.length === 0 ? (
          <p className="text-gray-500">No participants registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Phone</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">
                    Registration Date
                  </th>
                  <th className="py-2 px-4 border-b text-left">Checked In</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.api_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-2 px-4 border-b">{participant.name}</td>
                    <td className="py-2 px-4 border-b">{participant.email}</td>
                    <td className="py-2 px-4 border-b">
                      {participant.phone_number || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b capitalize">
                      {participant.status}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {participant.registered_at
                        ? new Date(
                            participant.registered_at
                          ).toLocaleDateString()
                        : new Date(participant.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {participant.checked_in_at
                        ? new Date(participant.checked_in_at).toLocaleString()
                        : "Not checked in"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {participants.length > 0 && participants[0].registration_answers && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              Registration Answers
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="py-2 px-4 border-b text-left">
                      Participant
                    </th>
                    {participants[0].registration_answers.map((qa, index) => (
                      <th key={index} className="py-2 px-4 border-b text-left">
                        {qa.question}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => {
                    if (!participant.registration_answers) return null;
                    return (
                      <tr
                        key={participant.api_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-2 px-4 border-b">
                          {participant.name}
                        </td>
                        {participant.registration_answers.map((qa, index) => (
                          <td key={index} className="py-2 px-4 border-b">
                            {qa.answer}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
