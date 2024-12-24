import { where } from "firebase/firestore";

/**
 * Format a plan name to be more human readable
 * @param {string} plan - The plan name.
 * @returns {string} - The formatted plan name.
 */
export const formatPlan = (plan) =>
  plan
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const toSnakeCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("_");

export const applyFilters = (filterClauses, field, value) => {
  if (!value) return;
  if (field === "credits") {
    const [min, max] = value.split("-");
    filterClauses.push(where(field, ">=", Number(max === undefined ? min.slice(0, -1) : min)));
    if (max !== undefined) {
      filterClauses.push(where(field, "<=", Number(max)));
    }
  }
  if (field === "status") {
    if (value === "Non-verified") {
      filterClauses.push(where("verified", "==", false));
    } else if (value === "Verified") {
      filterClauses.push(
        where("verified", "==", true),
        where("personal_document.status", "==", "approved"),
        where("sector_experience_document.status", "==", "approved")
      );
    } else if (value === "Waiting for submission") {
      filterClauses.push(
        where("verified", "==", false),
        where("personal_document.status", "==", "pending"),
        where("sector_experience_document.status", "==", "pending")
      );
    }
  }
  if (field === "plan") {
    const formattedPlan = value.split(" ").join("_").toLowerCase();
    filterClauses.push(where("pricing_plan", "==", formattedPlan));
  }
};

export const removeEmptyValues = (obj) => {
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === "object") {
      const newValue = removeEmptyValues(value);
      if (Object.keys(newValue).length > 0) {
        newObj[key] = newValue.label || newValue;
      }
    } else if (value || typeof value === "boolean") {
      newObj[key] = value;
    }
  });
  return newObj;
};
