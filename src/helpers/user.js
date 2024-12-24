export const isRecruiter = (currentUser) => currentUser.role === "recruiter";

export const isCandidate = (currentUser) => currentUser.role === "candidate";

export const isAdmin = (currentUser) => currentUser.role === "admin";

export const isFirstTimeAdmin = (currentUser) =>
  isAdmin(currentUser) && !currentUser.first_name && !currentUser.last_name;
