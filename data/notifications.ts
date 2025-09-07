import type { Notification } from "@/types"

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "like",
    title: "Nuevo like",
    message: 'A sofia_curadora le gustó tu post sobre "Serie: Nebulae 02"',
    read: false,
    createdAt: new Date("2024-03-15T19:30:00"),
    actionUrl: "/post/4",
  },
  {
    id: "2",
    userId: "1",
    type: "comment",
    title: "Nuevo comentario",
    message: "vera_ilustradora comentó en tu post",
    read: false,
    createdAt: new Date("2024-03-15T18:45:00"),
    actionUrl: "/post/4",
  },
  {
    id: "3",
    userId: "1",
    type: "follow",
    title: "Nuevo seguidor",
    message: "tadeo_lector comenzó a seguir tu faceta Artista",
    read: true,
    createdAt: new Date("2024-03-15T16:20:00"),
    actionUrl: "/profile/tadeo_lector",
  },
  {
    id: "4",
    userId: "1",
    type: "mention",
    title: "Te mencionaron",
    message: "ilan_dev te mencionó en #general",
    read: true,
    createdAt: new Date("2024-03-15T15:10:00"),
    actionUrl: "/spaces/1/channels/1",
  },
  {
    id: "5",
    userId: "1",
    type: "space_invite",
    title: "Invitación a espacio",
    message: 'lia_moderadora te invitó a unirte a "Música Sintética"',
    read: false,
    createdAt: new Date("2024-03-15T14:30:00"),
    actionUrl: "/spaces/5",
  },
  {
    id: "6",
    userId: "1",
    type: "like",
    title: "Nuevo like",
    message: 'A nyla_escritora le gustó tu post sobre "Interfaces que respiran"',
    read: true,
    createdAt: new Date("2024-03-15T13:15:00"),
    actionUrl: "/post/7",
  },
  {
    id: "7",
    userId: "1",
    type: "comment",
    title: "Nuevo comentario",
    message: "ana_editora comentó en tu post sobre diseño",
    read: true,
    createdAt: new Date("2024-03-15T12:45:00"),
    actionUrl: "/post/7",
  },
  {
    id: "8",
    userId: "1",
    type: "follow",
    title: "Nuevo seguidor",
    message: "marco_admin comenzó a seguir tu faceta Profesional",
    read: false,
    createdAt: new Date("2024-03-15T11:30:00"),
    actionUrl: "/profile/marco_admin",
  },
  {
    id: "9",
    userId: "1",
    type: "mention",
    title: "Te mencionaron",
    message: "sofia_curadora te mencionó en #discusión-hyperion",
    read: true,
    createdAt: new Date("2024-03-15T10:20:00"),
    actionUrl: "/spaces/1/channels/3",
  },
  {
    id: "10",
    userId: "1",
    type: "space_invite",
    title: "Invitación a espacio",
    message: 'ilan_dev te invitó a unirte a "Desarrolladores Web3"',
    read: true,
    createdAt: new Date("2024-03-15T09:15:00"),
    actionUrl: "/spaces/4",
  },
  {
    id: "11",
    userId: "1",
    type: "like",
    title: "Nuevo like",
    message: 'A lia_moderadora le gustó tu post sobre "Bocetos para un atlas de nebulosas"',
    read: true,
    createdAt: new Date("2024-03-15T08:45:00"),
    actionUrl: "/post/6",
  },
  {
    id: "12",
    userId: "1",
    type: "comment",
    title: "Nuevo comentario",
    message: "tadeo_lector comentó en tu post sobre arte generativo",
    read: true,
    createdAt: new Date("2024-03-15T08:20:00"),
    actionUrl: "/post/6",
  },
]

export const notifications = mockNotifications

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter((notification) => notification.userId === userId && !notification.read)
}

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

export const markAllAsRead = (userId: string): void => {
  mockNotifications.forEach((notification) => {
    if (notification.userId === userId) {
      notification.read = true;
    }
  });
};
