import type { 
  Event, 
  EventCategory, 
  Ticket, 
  EventAttendee, 
  EventStream, 
  EventChat, 
  EventAnalytics 
} from "@/types"
import { mockUsers } from "./users"
import { mockSpaces } from "./spaces"

export const eventCategories: EventCategory[] = [
  {
    id: "workshop",
    name: "Talleres",
    icon: "🔧",
    description: "Sesiones prácticas y educativas",
    color: "#3B82F6"
  },
  {
    id: "conference",
    name: "Conferencias",
    icon: "🎤",
    description: "Eventos profesionales y networking",
    color: "#8B5CF6"
  },
  {
    id: "meetup",
    name: "Meetups",
    icon: "👥",
    description: "Encuentros informales de comunidad",
    color: "#10B981"
  },
  {
    id: "concert",
    name: "Conciertos",
    icon: "🎵",
    description: "Eventos musicales y artísticos",
    color: "#F59E0B"
  },
  {
    id: "exhibition",
    name: "Exposiciones",
    icon: "🎨",
    description: "Muestras de arte y creatividad",
    color: "#EF4444"
  },
  {
    id: "webinar",
    name: "Webinars",
    icon: "💻",
    description: "Seminarios online especializados",
    color: "#06B6D4"
  },
  {
    id: "streaming",
    name: "Streaming",
    icon: "📺",
    description: "Transmisiones en vivo",
    color: "#EC4899"
  },
  {
    id: "competition",
    name: "Competencias",
    icon: "🏆",
    description: "Concursos y desafíos",
    color: "#F97316"
  }
]

export const mockEvents: Event[] = [
  {
    id: "1",
    organizerId: "1",
    organizer: mockUsers[0],
    spaceId: "1",
    space: mockSpaces[0],
    title: "Taller de Arte Digital: Creando Mundos Cósmicos",
    description: "Aprende técnicas avanzadas de arte digital para crear paisajes cósmicos únicos. En este taller de 3 horas, exploraremos herramientas de Photoshop, conceptos de composición y técnicas de iluminación para crear obras que transporten al espectador a otros mundos.",
    type: "workshop",
    category: eventCategories[0],
    startDate: new Date("2024-02-15T18:00:00Z"),
    endDate: new Date("2024-02-15T21:00:00Z"),
    timezone: "America/Mexico_City",
    location: {
      type: "virtual",
      virtualUrl: "https://zoom.us/j/123456789",
      platform: "zoom",
      instructions: "Se enviará el enlace 15 minutos antes del evento"
    },
    capacity: 50,
    currentAttendees: 32,
    price: 29.99,
    currency: "USD",
    isFree: false,
    status: "published",
    visibility: "public",
    tags: ["arte digital", "photoshop", "cósmico", "taller", "ilustración"],
    images: [
      "/digital-art-avatar.png",
      "/placeholder.svg"
    ],
    coverImage: "/digital-art-avatar.png",
    isLiveStream: true,
    streamUrl: "https://stream.lumora.com/event-1",
    streamStatus: "offline",
    maxViewers: 100,
    currentViewers: 0,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    organizerId: "2",
    organizer: mockUsers[1],
    spaceId: "2",
    space: mockSpaces[1],
    title: "Conferencia: El Futuro del Desarrollo Web",
    description: "Únete a expertos del desarrollo web para discutir las últimas tendencias, tecnologías emergentes y el futuro de la industria. Networking, charlas técnicas y oportunidades de colaboración.",
    type: "conference",
    category: eventCategories[1],
    startDate: new Date("2024-02-20T09:00:00Z"),
    endDate: new Date("2024-02-20T17:00:00Z"),
    timezone: "America/Mexico_City",
    location: {
      type: "physical",
      address: "Av. Insurgentes Sur 1234",
      city: "Ciudad de México",
      country: "México",
      coordinates: { lat: 19.4326, lng: -99.1332 }
    },
    capacity: 200,
    currentAttendees: 156,
    price: 89.99,
    currency: "USD",
    isFree: false,
    status: "published",
    visibility: "public",
    tags: ["desarrollo web", "tecnología", "networking", "conferencia", "programación"],
    images: [
      "/curator-avatar.png",
      "/placeholder.svg"
    ],
    coverImage: "/curator-avatar.png",
    isLiveStream: false,
    streamStatus: "offline",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "3",
    organizerId: "3",
    organizer: mockUsers[2],
    title: "Meetup: Comunidad de Escritores Lumora",
    description: "Encuentro mensual de la comunidad de escritores. Comparte tus proyectos, recibe feedback y conecta con otros escritores. Habrá lectura de textos, talleres de escritura creativa y networking.",
    type: "meetup",
    category: eventCategories[2],
    startDate: new Date("2024-02-10T19:00:00Z"),
    endDate: new Date("2024-02-10T21:00:00Z"),
    timezone: "America/Mexico_City",
    location: {
      type: "hybrid",
      address: "Café Literario, Centro Histórico",
      city: "Ciudad de México",
      country: "México",
      virtualUrl: "https://meet.google.com/abc-defg-hij",
      platform: "custom",
      instructions: "Presencial en el café o virtual por Google Meet"
    },
    capacity: 30,
    currentAttendees: 25,
    price: 0,
    currency: "USD",
    isFree: true,
    status: "published",
    visibility: "public",
    tags: ["escritura", "literatura", "comunidad", "meetup", "creatividad"],
    images: [
      "/editor-avatar.png",
      "/placeholder.svg"
    ],
    coverImage: "/editor-avatar.png",
    isLiveStream: false,
    streamStatus: "offline",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "4",
    organizerId: "4",
    organizer: mockUsers[3],
    title: "Concierto Virtual: Música Electrónica Cósmica",
    description: "Una experiencia musical única con artistas de música electrónica que crean atmósferas cósmicas. Transmisión en vivo con chat interactivo y efectos visuales inmersivos.",
    type: "concert",
    category: eventCategories[3],
    startDate: new Date("2024-02-25T22:00:00Z"),
    endDate: new Date("2024-02-26T02:00:00Z"),
    timezone: "America/Mexico_City",
    location: {
      type: "virtual",
      virtualUrl: "https://stream.lumora.com/concert-1",
      platform: "custom",
      instructions: "Acceso directo desde Lumora"
    },
    capacity: 1000,
    currentAttendees: 423,
    price: 15.99,
    currency: "USD",
    isFree: false,
    status: "published",
    visibility: "public",
    tags: ["música", "electrónica", "cósmico", "concierto", "virtual"],
    images: [
      "/developer-profile.png",
      "/placeholder.svg"
    ],
    coverImage: "/developer-profile.png",
    isLiveStream: true,
    streamUrl: "https://stream.lumora.com/concert-1",
    streamStatus: "offline",
    maxViewers: 1000,
    currentViewers: 0,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "5",
    organizerId: "5",
    organizer: mockUsers[4],
    title: "Exposición: Arte Digital Contemporáneo",
    description: "Exposición virtual de arte digital contemporáneo con obras de artistas emergentes y establecidos. Recorrido virtual interactivo con explicaciones de los artistas.",
    type: "exhibition",
    category: eventCategories[4],
    startDate: new Date("2024-02-01T10:00:00Z"),
    endDate: new Date("2024-02-28T18:00:00Z"),
    timezone: "America/Mexico_City",
    location: {
      type: "virtual",
      virtualUrl: "https://gallery.lumora.com/exhibition-1",
      platform: "custom",
      instructions: "Acceso 24/7 durante el mes de febrero"
    },
    capacity: 500,
    currentAttendees: 89,
    price: 0,
    currency: "USD",
    isFree: true,
    status: "published",
    visibility: "public",
    tags: ["arte digital", "exposición", "contemporáneo", "virtual", "galería"],
    images: [
      "/artist-profile.png",
      "/placeholder.svg"
    ],
    coverImage: "/artist-profile.png",
    isLiveStream: false,
    streamStatus: "offline",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  }
]

export const mockTickets: Ticket[] = [
  {
    id: "1",
    eventId: "1",
    event: mockEvents[0],
    name: "Entrada General",
    description: "Acceso completo al taller de arte digital",
    price: 29.99,
    currency: "USD",
    quantity: 50,
    sold: 32,
    available: 18,
    benefits: [
      "Acceso al taller completo",
      "Materiales digitales incluidos",
      "Certificado de participación",
      "Acceso a la grabación"
    ],
    isActive: true,
    saleStartDate: new Date("2024-01-10"),
    saleEndDate: new Date("2024-02-15T17:00:00Z"),
    maxPerUser: 2,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    eventId: "2",
    event: mockEvents[1],
    name: "Entrada VIP",
    description: "Acceso premium con beneficios exclusivos",
    price: 149.99,
    currency: "USD",
    quantity: 50,
    sold: 25,
    available: 25,
    benefits: [
      "Acceso a todas las charlas",
      "Networking exclusivo",
      "Materiales premium",
      "Coffee break incluido",
      "Acceso anticipado"
    ],
    isActive: true,
    saleStartDate: new Date("2024-01-05"),
    saleEndDate: new Date("2024-02-20T08:00:00Z"),
    maxPerUser: 1,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "3",
    eventId: "4",
    event: mockEvents[3],
    name: "Entrada Virtual",
    description: "Acceso al concierto virtual",
    price: 15.99,
    currency: "USD",
    quantity: 1000,
    sold: 423,
    available: 577,
    benefits: [
      "Acceso al concierto",
      "Chat interactivo",
      "Efectos visuales",
      "Acceso a la grabación por 7 días"
    ],
    isActive: true,
    saleStartDate: new Date("2024-01-12"),
    saleEndDate: new Date("2024-02-25T21:00:00Z"),
    maxPerUser: 5,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18")
  }
]

export const mockEventAttendees: EventAttendee[] = [
  {
    id: "1",
    eventId: "1",
    event: mockEvents[0],
    userId: "2",
    user: mockUsers[1],
    ticketId: "1",
    ticket: mockTickets[0],
    status: "confirmed",
    rsvpDate: new Date("2024-01-12"),
    isPaid: true,
    paymentStatus: "paid",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "2",
    eventId: "2",
    event: mockEvents[1],
    userId: "3",
    user: mockUsers[2],
    ticketId: "2",
    ticket: mockTickets[1],
    status: "confirmed",
    rsvpDate: new Date("2024-01-08"),
    isPaid: true,
    paymentStatus: "paid",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  }
]

export const mockEventStreams: EventStream[] = [
  {
    id: "1",
    eventId: "1",
    event: mockEvents[0],
    title: "Taller de Arte Digital - Sesión 1",
    description: "Primera sesión del taller de arte digital",
    streamUrl: "https://stream.lumora.com/event-1",
    streamKey: "live_123456789",
    status: "scheduled",
    startTime: new Date("2024-02-15T18:00:00Z"),
    maxViewers: 100,
    currentViewers: 0,
    totalViewers: 0,
    chatEnabled: true,
    recordingEnabled: true,
    quality: "1080p",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  }
]

export const mockEventChat: EventChat[] = [
  {
    id: "1",
    eventId: "1",
    event: mockEvents[0],
    userId: "2",
    user: mockUsers[1],
    message: "¡Excelente taller! ¿Cuándo será la próxima sesión?",
    type: "text",
    isModerated: false,
    isHighlighted: false,
    createdAt: new Date("2024-01-15T18:30:00Z")
  }
]

export const mockEventAnalytics: EventAnalytics[] = [
  {
    eventId: "1",
    event: mockEvents[0],
    totalRegistrations: 45,
    totalAttendees: 32,
    totalRevenue: 959.68,
    averageRating: 4.8,
    totalReviews: 28,
    socialShares: 156,
    websiteVisits: 2340,
    conversionRate: 0.71,
    topReferrers: ["Instagram", "Twitter", "Direct"],
    attendeeDemographics: {
      ageGroups: { "18-25": 15, "26-35": 12, "36-45": 5 },
      locations: { "México": 20, "España": 8, "Argentina": 4 },
      interests: { "arte": 25, "diseño": 18, "tecnología": 12 }
    },
    engagementMetrics: {
      averageWatchTime: 165,
      chatMessages: 89,
      questionsAsked: 23,
      reactions: 156
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  }
]

// Utility functions
export const getEventsBySpace = (spaceId: string): Event[] => {
  return mockEvents.filter(event => event.spaceId === spaceId)
}

export const getEventsByOrganizer = (organizerId: string): Event[] => {
  return mockEvents.filter(event => event.organizerId === organizerId)
}

export const getEventsByCategory = (categoryId: string): Event[] => {
  return mockEvents.filter(event => event.category.id === categoryId)
}

export const getEventById = (eventId: string): Event | undefined => {
  return mockEvents.find(event => event.id === eventId)
}

export const getTicketsByEvent = (eventId: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.eventId === eventId)
}

export const getAttendeesByEvent = (eventId: string): EventAttendee[] => {
  return mockEventAttendees.filter(attendee => attendee.eventId === eventId)
}

export const getUpcomingEvents = (): Event[] => {
  const now = new Date()
  return mockEvents.filter(event => event.startDate > now && event.status === "published")
}

export const getLiveEvents = (): Event[] => {
  const now = new Date()
  return mockEvents.filter(event => 
    event.startDate <= now && 
    event.endDate >= now && 
    event.status === "published"
  )
}

export const getEventAnalytics = (eventId: string): EventAnalytics | undefined => {
  return mockEventAnalytics.find(analytics => analytics.eventId === eventId)
}
