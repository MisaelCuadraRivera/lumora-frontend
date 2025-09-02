import { mockUsers, users, getUserById, getUserByUsername } from "./users"
import { mockSpaces, spaces, getSpaceById, getJoinedSpaces } from "./spaces"
import { mockPosts, posts, getPostById, getFeedPosts } from "./posts"
import { mockMessages, messages, getMessagesByChannel } from "./messages"
import { mockNotifications, notifications, getUnreadNotifications } from "./notifications"
import { mockChannels, channels, getChannelsBySpace, getChannelById } from "./channels"
import { mockReports, getReportsByStatus, getReportsByReporter, getReportsByModerator } from "./reports"

// Re-export all data
export {
  mockUsers,
  users,
  getUserById,
  getUserByUsername,
  mockSpaces,
  spaces,
  getSpaceById,
  getJoinedSpaces, // Added missing getJoinedSpaces export
  mockPosts,
  posts,
  getPostById,
  getFeedPosts, // Added missing getFeedPosts export
  mockMessages,
  messages,
  getMessagesByChannel,
  mockNotifications,
  notifications,
  getUnreadNotifications, // Added missing getUnreadNotifications export
  mockChannels,
  channels,
  getChannelsBySpace,
  getChannelById,
  mockReports,
  getReportsByStatus,
  getReportsByReporter,
  getReportsByModerator,
}

// Utility functions for data manipulation
export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "ahora"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `hace ${minutes} min`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `hace ${hours}h`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `hace ${days}d`
  } else {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
