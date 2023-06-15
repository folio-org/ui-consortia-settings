export const jobExecutions = new Array(5).fill(null).map((_, i) => ({
  id: `job-${i}`,
  fileName: `fileName-${i}`,
  status: `status-${i}`,
  totalRecords: `totalRecords-${i}`,
  jobProfileName: `jobProfileName-${i}`,
  startedDate: `2023-06-0${i}T09:00:00.260+00:00`,
  completedDate: `2023-06-0${i}T10:00:00.260+00:00`,
  runBy: `runBy-${i}`,
  hrId: i,
  progress: {
    total: 100,
  },
}));
