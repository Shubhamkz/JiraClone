const { ActivityType } = require("./activityType");

const ActivityMessage = {
  [ActivityType.USER_CREATED]: "User was created",
  [ActivityType.USER_UPDATED]: "User was updated",
  [ActivityType.USER_DELETED]: "User was deleted",
  [ActivityType.USER_LOGIN]: "User logged in",
  [ActivityType.USER_LOGOUT]: "User logged out",

  [ActivityType.PROJECT_CREATED]: "Project was created",
  [ActivityType.PROJECT_UPDATED]: "Project was updated",
  [ActivityType.PROJECT_DELETED]: "Project was deleted",
  [ActivityType.PROJECT_MEMBER_ADDED]: "Project member was added",
  [ActivityType.PROJECT_MEMBER_REMOVED]: "Project member was removed",
  [ActivityType.PROJECT_MEMBER_ROLE_CHANGED]: "Project member role was changed",

  [ActivityType.SPRINT_CREATED]: "Sprint was created",
  [ActivityType.SPRINT_UPDATED]: "Sprint was updated",
  [ActivityType.SPRINT_DELETED]: "Sprint was deleted",
  [ActivityType.SPRINT_STARTED]: "Sprint started",
  [ActivityType.SPRINT_COMPLETED]: "Sprint completed",
  [ActivityType.SPRINT_CLOSED]: "Sprint closed",

  [ActivityType.TICKET_CREATED]: "Ticket was created",
  [ActivityType.TICKET_UPDATED]: "Ticket was updated",
  [ActivityType.TICKET_DELETED]: "Ticket was deleted",
  [ActivityType.TICKET_ASSIGNED]: "Ticket was assigned",
  [ActivityType.TICKET_UNASSIGNED]: "Ticket was unassigned",
  [ActivityType.TICKET_STATUS_CHANGED]: "Ticket status changed",
  [ActivityType.TICKET_PRIORITY_CHANGED]: "Ticket priority changed",
  [ActivityType.TICKET_MOVED_TO_SPRINT]: "Ticket moved to sprint",

  [ActivityType.COMMENT_ADDED]: "Comment added",
  [ActivityType.COMMENT_UPDATED]: "Comment updated",
  [ActivityType.COMMENT_DELETED]: "Comment deleted",

  [ActivityType.ACTIVITY_LOG_CLEARED]: "Activity log cleared",
  [ActivityType.SYSTEM_MIGRATION]: "System migration executed",
  [ActivityType.NOTIFICATION_SENT]: "Notification sent",
};

export default ActivityMessage;
