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
  formId: "new-user-recrutier",
  formField: {
    companyName: {
      name: "companyName",
      label: "Company Name",
      type: "text",
      errorMsg: "Company name is required.",
    },
    phoneNumber: {
      name: "phoneNumber",
      label: "Mobile number (start with +44)",
      type: "text",
      errorMsg: "Mobile number is required.",
    },
    postalCode: {
      name: "postalCode",
      label: "Postcode (UK only)",
      type: "text",
      errorMsg: "Zip is required.",
      invalidMsg: "Zipcode is not valie (e.g. 70000).",
    },
  },
};
