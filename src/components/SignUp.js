import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import app from "../firebase";
import { v4 as uuidv4 } from "uuid";

function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const [message, setMessage] = useState("");
  const { sendEmailVerification } = useAuth();

  //database ref
  const ref = app.firestore().collection("Users");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .when("password", {
          is: (password) => (password && password.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Passwords do not match"
          ),
        }),
    }),
    onSubmit: async (values) => {
      //make post request here with user info
      try {
        setError("");
        setLoading(true);
        // signup user with email and password
        await signUp(values.email, values.password);
        setMessage("Account created. Please sign in.");
        await sendEmailVerification();
      } catch {
        setError("Failed to create account");
      }

      // create user document in user collection if sign up is successful
      ref.doc(values.email).set({
        uuid: uuidv4(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        online: false,
        avatar: null,
        joined: new Date(),
      });

      setLoading(false);
    },
  });

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Sign Up</h3>
        <form onSubmit={formik.handleSubmit}>
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="firstName">First Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter first name"
              id="firstName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error">{formik.errors.firstName}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="lastName">Last Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter last name"
              id="lastName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error">{formik.errors.lastName}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              id="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="w-100 text-center mt-2">
          <p>
            Already have an account? <Link to="/signIn">Sign in</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
