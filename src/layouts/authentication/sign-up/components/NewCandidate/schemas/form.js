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

export default {
  formId: "new-user-candidate",
  formField: {
    firstName: {
      name: "firstName",
      label: "First Name",
      type: "text",
      errorMsg: "First name is required.",
    },
    lastName: {
      name: "lastName",
      label: "Last Name",
      type: "text",
      errorMsg: "Last name is required.",
    },
    email: {
      name: "email",
      label: "Email Address",
      type: "email",
      errorMsg: "Email address is required.",
      invalidMsg: "Your email address is invalid",
    },
    password: {
      name: "password",
      label: "Password",
      type: "password",
      errorMsg: "Password is required.",
      invalidMsg: "Your password should be more than 6 characters.",
    },
    phoneNumber: {
      name: "phoneNumber",
      label: "Mobile number (start with +44)",
      type: "text",
      errorMsg: "Mobile number is required.",
    },
    postalCode: {
      name: "postalCode",
      label: "Postcode",
      type: "string",
      errorMsg: "Postal code is required.",
      invalidMsg: "Postal code is not valie (e.g. 70000).",
    },
    agreedToBeContacted: {
      name: "agreedToBeContacted",
      label: "Agreed to be contacted: ",
      type: "boolean",
      errorMsg: "Agreement is required.",
      invalidMsg: "Agreement is not valied.",
    },
    dailyJobUpdatePreference: {
      name: "dailyJobUpdatePreference",
      label: "Daily Job Update Preference",
      type: "string",
      errorMsg: "Period is required.",
      invalidMsg: "Period is not valied.",
    },
  },
};
