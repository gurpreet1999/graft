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

import * as Yup from "yup";
import checkout from "layouts/authentication/sign-up/components/NewRecrutier/schemas/form";
import "yup-phone";

const {
  formField: { companyName, phoneNumber, postalCode },
} = checkout;

export default Yup.object().shape({
  [phoneNumber.name]: Yup.string()
    .matches(/^[0-9\s()+-]*$/, "Invalid characters in phone number")
    .phone("UK")
    .required("Required")
    .required(phoneNumber.errorMsg),
  [postalCode.name]: Yup.string().required(postalCode.errorMsg).min(6, postalCode.invalidMsg),
  [companyName.name]: Yup.string().required(companyName.errorMsg),
});
