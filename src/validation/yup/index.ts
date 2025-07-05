import { Description } from "./../../interface/test";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

export const checkoutSchema = Yup.object().shape({
  live_course_id: Yup.string(),
  payment_id: Yup.string(),
  bank_account_id: Yup.string(),
  bank_name: Yup.string(),
  bank_number: Yup.string(),
  bank_image: Yup.string(),
  amount: Yup.string(),
  discount: Yup.string(),
  totalWithVat: Yup.string(),
  class_id: Yup.string(),
  // moyasar state
  cvc: Yup.string().required(),
  year: Yup.string().required(),
  month: Yup.string().required(),
  number: Yup.string().required(),
  // name: Yup.string().required(),
});

export const delegateRegisterSchema = Yup.object().shape({
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "The passwords are not a match")
    .min(8, "The passwords are not a match"),
  phone: Yup.string()
    .test("ValidPhone", "Mobile number is Invalid", (val) =>
      val ? isValidPhoneNumber(val) : true
    )
    .required("Mobile number is a required filed"),
  gender: Yup.string().required(),
  id_number: Yup.string().required(),
  // personal_image: Yup.string().required(),
});

export const signupSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "The passwords are not a match")
    .min(8, "The passwords are not a match"),
  phone: Yup.string()
    .test("ValidPhone", "Mobile number is Invalid", (val) =>
      val ? isValidPhoneNumber(val) : true
    )
    .required("Mobile number is a required filed"),
  gender: Yup.string().required(),
  extra_phone: Yup.string().test(
    "ValidPhone",
    "Mobile number is Invalid",
    (val) => (val ? isValidPhoneNumber(val) : true)
  ),
  isTermAgreed: Yup.bool().oneOf(
    [true],
    "Terms Privacy Policy must be checked"
  ),
});

export const contactUsSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().required(),
  description: Yup.string().required(),
});

// Forgot password flow validation schemas
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export const verifyResetCodeSchema = Yup.object().shape({
  code: Yup.string().required("Verification code is required"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});
