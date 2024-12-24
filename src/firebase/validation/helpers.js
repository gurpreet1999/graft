import {
  allRoles,
  establishments,
  yearsOfExperience,
  constructionRoles,
  cscsCardTypes,
} from "constants/experience";
import { dailyJobUpdatePreferences } from "constants/candidate";
import { hospitalityEmploymentTypes, constructionEmploymentTypes } from "constants/job";

// Hospitality related
const isEstablishmentValid = (establishment) => establishments.includes(establishment);
const isRoleValid = (role) => allRoles.includes(role);
const isYearsOfExperienceValid = (years) => yearsOfExperience.includes(years);

// Construction related
const isConstructionRoleValid = (role) => constructionRoles.includes(role);
const isCscsCardTypeValid = (type) => cscsCardTypes.includes(type);

// Job related
const isDailyJobUpdatePreferenceValid = (period) => dailyJobUpdatePreferences.includes(period);
const isHospitalityEmploymentTypeValid = (employmentType) =>
  hospitalityEmploymentTypes.includes(employmentType);
const isConstructionEmploymentTypeValid = (employmentType) =>
  constructionEmploymentTypes.includes(employmentType);

// Hospitality related
export const testEstablishment = ({ field, message, isOptional = false, additionalValues = [] }) =>
  field.test(
    "is-valid-establishment",
    message || "Invalid establishment.",
    (value) =>
      (isOptional && !value) || isEstablishmentValid(value) || additionalValues.includes(value)
  );
export const testRole = ({ field, message, isOptional = false }) =>
  field.test(
    "is-valid-role",
    message || "Invalid role.",
    (value) => (isOptional && !value) || isRoleValid(value)
  );
export const testYearsOfExperience = ({ field, message, additionalValues = [] }) =>
  field.test(
    "is-valid-years-of-experience",
    message || "Invalid years of experience.",
    (value) => isYearsOfExperienceValid(value) || additionalValues.includes(value)
  );

// Construction related
export const testConstructionRole = ({ field, message, additionalValues = [] }) =>
  field.test(
    "is-construction-role-valid",
    message || "Invalid construction role.",
    (value) => isConstructionRoleValid(value) || additionalValues.includes(value)
  );
export const testCscsCardType = ({ field, message, additionalValues = [] }) =>
  field.test(
    "is-cscs-card-type-valid",
    message || "Invalid type of CSCS card.",
    (value) => isCscsCardTypeValid(value) || additionalValues.includes(value)
  );

// Job related
export const testDailyJobUpdatePreference = ({ field }) =>
  field.test("is-valid-period", "Invalid period to be contacted.", isDailyJobUpdatePreferenceValid);
export const testHospitalityEmploymentType = ({ field }) =>
  field.test(
    "is-valid-employment-type",
    "Invalid employment type.",
    isHospitalityEmploymentTypeValid
  );
export const testConstructionEmploymentType = ({ field }) =>
  field.test(
    "is-valid-employment-type",
    "Invalid employment type.",
    isConstructionEmploymentTypeValid
  );
