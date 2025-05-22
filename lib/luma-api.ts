type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    cover_url: string;
    url: string;
  };
};

type EventDetailData = {
  api_id: string;
  name: string;
  start_at: string;
  end_at: string;
  cover_url: string;
  url: string;
  description: string;
  location: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  hosts: Array<{
    name: string;
    avatar_url: string;
  }>;
};

type ParticipantData = {
  api_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  registered_at?: string;
  checked_in_at?: string | null;
  phone_number?: string;
  registration_answers?: Array<{
    question: string;
    answer: string;
  }>;
};

export async function getEvents(): Promise<EventData[]> {
  const res = await fetch(
    "https://public-api.lu.ma/public/v1/calendar/list-events",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_API_KEY as string,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = (await res.json()) as { entries: EventData[] };
  return data.entries;
}

export async function getEventById(eventId: string): Promise<EventDetailData> {
  const res = await fetch(
    `https://api.lu.ma/public/v1/event/get?api_id=${eventId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_API_KEY as string,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch event details for ${eventId}`);
  }

  const data = await res.json();
  return data.event;
}

export async function getEventParticipants(
  eventId: string
): Promise<ParticipantData[]> {
  const res = await fetch(
    `https://public-api.lu.ma/public/v1/event/get-guests?event_api_id=${eventId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_API_KEY as string,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch participants for event ${eventId}`);
  }

  const data = await res.json();

  // Map the nested guest structure to our ParticipantData type
  const participants: ParticipantData[] = data.entries.map((entry: any) => ({
    api_id: entry.api_id,
    name:
      entry.guest.name ||
      `${entry.guest.user_first_name} ${entry.guest.user_last_name}`,
    email: entry.guest.email || entry.guest.user_email,
    status: entry.guest.approval_status,
    created_at: entry.guest.created_at,
    registered_at: entry.guest.registered_at,
    checked_in_at: entry.guest.checked_in_at,
    phone_number: entry.guest.phone_number,
    registration_answers: entry.guest.registration_answers,
  }));

  return participants;
}
