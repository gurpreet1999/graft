import checkout from "layouts/authentication/sign-up/schemas/Shared/form";

const {
  formField: { firstName, lastName, email, password, role },
} = checkout;

const initialValues = {
  [firstName.name]: "",
  [lastName.name]: "",
  [email.name]: "",
  [password.name]: "",
  [role.name]: "",
};

export default initialValues;
