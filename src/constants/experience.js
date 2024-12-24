import { toSnakeCase } from "utilities/helpers";

const sectors = ["Construction", "Hospitality"];

// Shared fields

const yearsOfExperience = ["Up to 1 year", "1-2 years", "3-5 years", "5+ years"];

// Construction related fields

const constructionRoles = [
  "General Labour",
  "Banksman / Traffic Marshall",
  "Telehandler",
  "Hod Carrier",
  "Bricklayer",
  "Carpenter",
  "Groundworker",
  "Machine Driver",
  "Groundworker Gangs",
  "Bricklaying Gangs",
];

const cscsCardTypes = [
  "Green Card",
  "Blue Card",
  "Gold Card",
  "Black Card",
  "CPCS Red (Or Equivalent)",
  "CPCS Blue (Or Equivalent)",
  "COTS",
  "PART 1",
  "PART 2",
  "ADVANCED SCAFFOLDER",
];

// Hospitality related fields

const establishments = [
  "Pub / Bar / Restaurant",
  "Luxury Hotel / Fine Dining",
  "Affordable Hotel",
  "Coffee Shop / Fast Food / Cafe",
  "Nightclubs, Events & Venues",
];

const frontOfHouseRoles = [
  "Waiter / Head Waiter",
  "Bartender",
  "Barista",
  "Receptionist / Maitre d’ / Host",
  "Concierge",
];

const backOfHouseRoles = ["Commis Chef", "Sous Chef", "Head Chef", "Barback", "Runner", "Porter"];

const managementRoles = [
  "Team Leader / Supervisor",
  "General Manager",
  "Restaurant Manager",
  "Assistant Manager",
];

const otherRoles = [
  "SIA Security",
  "Events / Venue / Catering Roles",
  "Crew Member (Fast Food)",
  "Cleaner",
];

const allRoles = [...frontOfHouseRoles, ...backOfHouseRoles, ...managementRoles, ...otherRoles];

const getDropdownOptions = (stringOptions) =>
  stringOptions.map((option) => ({ label: option, value: toSnakeCase(option) }));

const frontOfHouseRolesDropdown = {
  header: "Front of House",
  options: getDropdownOptions(frontOfHouseRoles),
};

const backOfHouseRolesDropdown = {
  header: "Back Of House",
  options: getDropdownOptions(backOfHouseRoles),
};

const managementRolesDropdown = {
  header: "Management",
  options: getDropdownOptions(managementRoles),
};

const otherRolesDropdown = {
  header: "Other",
  options: getDropdownOptions(otherRoles),
};

export const allRolesDropdown = [
  frontOfHouseRolesDropdown,
  backOfHouseRolesDropdown,
  managementRolesDropdown,
  otherRolesDropdown,
];

export { establishments, yearsOfExperience, allRoles, sectors, constructionRoles, cscsCardTypes };
