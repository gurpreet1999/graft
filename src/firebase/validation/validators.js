import {
  candidateSignUpSchema,
  recruiterSignUpSchema,
  signInSchema,
  searchCandidatesSchema,
  candidateUserSchema,
  recruiterUserSchema,
  adminUserSchema,
  jobSchema,
} from "./schemas";

const validateCandidateSignUp = (data) => candidateSignUpSchema.validateSync(data);
const validateRecruiterSignUp = (data) => recruiterSignUpSchema.validateSync(data);
const validateSignInFields = (data) => signInSchema.validateSync(data);

const validateSearchCandidatesFilters = (data) => searchCandidatesSchema.validateSync(data);

const validateJobFields = (data) => jobSchema.validateSync(data);

const validateCandidateUser = (data) => candidateUserSchema.validateSync(data);
const validateRecruiterUser = (data) => recruiterUserSchema.validateSync(data);
const validateAdminUser = (data) => adminUserSchema.validateSync(data);

export {
  // Sign up related
  validateCandidateSignUp,
  validateRecruiterSignUp,
  validateSignInFields,
  // Recruiter-related
  validateSearchCandidatesFilters,
  // Job-related
  validateJobFields,
  // User-related
  validateCandidateUser,
  validateRecruiterUser,
  validateAdminUser,
};
