export enum RequestStatusEnum {
  // Open Requests
  Open = 0,
  ApprovedInProgress = 1,

  // Completed Requests
  ApprovedCompleted = 2,
  Denied = 3,

  // Deleted Requests
  Cancelled = 4
}