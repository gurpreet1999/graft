/* eslint-disable camelcase */
/**
=========================================================
* Otis Admin PRO - v2.0.1
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import checkout from "layouts/authentication/sign-up/components/NewCandidate/schemas/form";

const {
  formField: { firstName, lastName, email, password, phoneNumber, postalCode },
} = checkout;

export default {
  [firstName.name]: "",
  [lastName.name]: "",
  [email.name]: "",
  [password.name]: "",
  [phoneNumber.name]: "",
  [postalCode.name]: "",
  role: "candidate",
  dailyJobUpdatePreference: "",
  agreedToBeContacted: false,
  verified: false,
  experience: {
    sector: "",
    mainTypeOfEstablishment: "",
    secondTypeOfEstablishment: "",
    yearsOfExperience: "",
    firstRolePreference: "",
    secondRolePreference: "",
    constructionRole: "",
    constructionCardType: "",
  },
};
