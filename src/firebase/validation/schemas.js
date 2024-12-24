import { boolean, object, number, string, mixed } from "yup";

import {
  testEstablishment,
  testYearsOfExperience,
  testRole,
  testDailyJobUpdatePreference,
  testConstructionRole,
  testCscsCardType,
  testConstructionEmploymentType,
  testHospitalityEmploymentType,
} from "./helpers";

function constant(value) {
  return mixed({ check: (v) => v === value });
}

const experienceHospitalitySchema = object({
  sector: constant("Hospitality").required(),
  mainTypeOfEstablishment: testEstablishment({
    field: string().required(),
    message: "Invalid main type of establishment.",
  }),
  secondTypeOfEstablishment: testEstablishment({
    field: string(),
    message: "Invalid second type of establishment.",
    isOptional: true,
  }),
  yearsOfExperience: testYearsOfExperience({
    field: string().required(),
  }),
  firstRolePreference: testRole({
    field: string().required(),
    message: "Invalid first role preference.",
  }),
  secondRolePreference: testRole({
    field: string(),
    message: "Invalid second role preference.",
    isOptional: true,
  }),
});

const experienceConstructionSchema = object({
  sector: constant("Construction").required(),
  constructionRole: testConstructionRole({
    field: string().required(),
    message: "Invalid construction role.",
  }),
  yearsOfExperience: testYearsOfExperience({
    field: string().required(),
    message: "Invalid construction experience.",
  }),
  constructionCardType: testCscsCardType({
    field: string().required(),
    message: "Invalid type of CSCS card.",
  }),
});

const experienceSchema = mixed()
  .when({
    is: (value) => value?.sector === "Construction",
    then: experienceConstructionSchema.required(),
  })
  .when({
    is: (value) => value?.sector !== "Construction",
    then: experienceHospitalitySchema.required(),
  });

const signInSchema = object({
  email: string().required().email(),
  password: string().required(),
});

const basicUserSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().required().email(),
});

const sharedUserSchema = object({
  phoneNumber: string().required(),
  postalCode: string().required(),
}).concat(basicUserSchema);
const adminUserSchema = basicUserSchema;
const candidateUserSchema = object({
  dailyJobUpdatePreference: testDailyJobUpdatePreference({ field: string().required() }),
  agreedToBeContacted: boolean().required(),
  experience: experienceSchema.required(),
}).concat(sharedUserSchema);
const recruiterUserSchema = object({
  companyName: string().required(),
}).concat(sharedUserSchema);

const candidateSignUpSchema = candidateUserSchema.concat(signInSchema);

const recruiterSignUpSchema = recruiterUserSchema.concat(signInSchema);

/* Recruiter: search candidates  */

const sharedSearchCandidatesSchema = object({
  yearsOfExperience: testYearsOfExperience({
    field: string().required(),
    additionalValues: ["any"],
  }),
  postalCode: string(),
  distance: number(),
});

const searchCandidatesHospitalitySchema = object({
  sector: constant("Hospitality").required(),
  role: testRole({ field: string().required() }),
  establishmentType: testEstablishment({ field: string().required(), additionalValues: ["any"] }),
}).concat(sharedSearchCandidatesSchema);

const searchCandidatesConstructionSchema = object({
  sector: constant("Construction").required(),
  constructionRole: testConstructionRole({ field: string().required(), additionalValues: ["any"] }),
  constructionCardType: testCscsCardType({ field: string().required(), additionalValues: ["any"] }),
}).concat(sharedSearchCandidatesSchema);

const searchCandidatesSchema = mixed()
  .when({
    is: (value) => value?.sector === "Construction",
    then: searchCandidatesConstructionSchema.required(),
  })
  .when({
    is: (value) => value?.sector !== "Construction",
    then: searchCandidatesHospitalitySchema.required(),
  });

/* Job Schemas */

const sharedJobSchema = object({
  postcode: string(),
  distance: number(),
  recruiter_id: string().required(),
  status: string().required(),
  verification: boolean().required(),
  years_of_experience: testYearsOfExperience({
    field: string().required(),
    additionalValues: ["any"],
  }),
});

const sharedJobDescriptionSchema = object({
  company_name: string().required(),
  location: string(),
  rate_of_pay: number(),
  contact_name: string().required(),
  contact_email: string().required().email(),
  contact_phone: string().required(),
});

const hospitalityJobDescriptionSchema = object({
  employment_type: testHospitalityEmploymentType({ field: string(), isOptional: true }),
}).concat(sharedJobDescriptionSchema);

const constructionJobDescriptionSchema = object({
  employment_type: testConstructionEmploymentType({ field: string(), isOptional: true }),
}).concat(sharedJobDescriptionSchema);

const hospitalityJobSchema = object({
  sector: constant("Hospitality").required(),
  role: testRole({ field: string().required(), message: "Invalid job role." }),
  area_of_expertise: testEstablishment({
    field: string().required(),
    message: "Invalid area of expertise.",
    additionalValues: ["any"],
  }),
  job_description: hospitalityJobDescriptionSchema.required(),
}).concat(sharedJobSchema);

const constructionJobSchema = object({
  sector: constant("Construction").required(),
  role: testConstructionRole({ field: string().required(), message: "Invalid construction role." }),
  area_of_expertise: testCscsCardType({
    field: string().required(),
    message: "Invalid type of CSCS card type.",
    additionalValues: ["any"],
  }),
  job_description: constructionJobDescriptionSchema.required(),
}).concat(sharedJobSchema);

const jobSchema = mixed()
  .when({
    is: (value) => value?.sector === "Construction",
    then: constructionJobSchema.required(),
  })
  .when({
    is: (value) => value?.sector !== "Construction",
    then: hospitalityJobSchema.required(),
  });

export {
  // User schemas
  adminUserSchema,
  candidateUserSchema,
  recruiterUserSchema,
  // Log in / Sign up schemas
  signInSchema,
  candidateSignUpSchema,
  recruiterSignUpSchema,
  // Recruiter-related schemas
  searchCandidatesSchema,
  // Job-related schemas
  jobSchema,
};
