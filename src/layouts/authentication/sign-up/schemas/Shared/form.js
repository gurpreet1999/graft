export default {
  formId: "new-user",
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
    role: {
      name: "role",
      label: "Reason for getting on the Graft?",
      type: "text",
      errorMsg: "Role is required.",
    },
  },
};
