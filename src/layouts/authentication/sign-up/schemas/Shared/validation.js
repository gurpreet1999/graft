import * as Yup from "yup";
import checkout from "layouts/authentication/sign-up/schemas/Shared/form";

const {
  formField: { firstName, lastName, email, password, role },
} = checkout;

const validationSchema = Yup.object().shape({
  [firstName.name]: Yup.string().required(firstName.errorMsg),
  [lastName.name]: Yup.string().required(lastName.errorMsg),
  [email.name]: Yup.string().required(email.errorMsg).email(email.invalidMsg),
  [password.name]: Yup.string().required(password.errorMsg).min(6, password.invalidMsg),
  [role.name]: Yup.string().required(role.errorMsg),
});

export default validationSchema;
