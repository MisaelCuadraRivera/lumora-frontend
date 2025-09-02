import type { Report } from "@/types"

export const mockReports: Report[] = [
  {
    id: "1",
    reporterId: "1",
    reportedUserId: "6",
    reason: "spam",
    description: "Usuario envía mensajes no solicitados constantemente",
    status: "pending",
    createdAt: new Date("2024-12-01T10:30:00Z")
  },
  {
    id: "2",
    reporterId: "2",
    reportedPostId: "post-123",
    reason: "inappropriate",
    description: "Contenido inapropiado en el post",
    status: "reviewed",
    createdAt: new Date("2024-11-28T15:45:00Z"),
    reviewedAt: new Date("2024-11-29T09:15:00Z"),
    moderatorId: "5"
  },
  {
    id: "3",
    reporterId: "3",
    reportedSpaceId: "space-456",
    reason: "harassment",
    description: "Acoso hacia miembros del espacio",
    status: "resolved",
    createdAt: new Date("2024-11-25T12:20:00Z"),
    reviewedAt: new Date("2024-11-26T14:30:00Z"),
    moderatorId: "5"
  }
]

export const getReportsByStatus = (status: Report["status"]) => {
  return mockReports.filter(report => report.status === status)
}

export const getReportsByReporter = (reporterId: string) => {
  return mockReports.filter(report => report.reporterId === reporterId)
}

export const getReportsByModerator = (moderatorId: string) => {
  return mockReports.filter(report => report.moderatorId === moderatorId)
}
