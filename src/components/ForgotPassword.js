import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
function ForgotPassword() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("form data", values);
      try {
        setError("");
        setLoading(true);
        await resetPassword(values.email);
        setMessage(
          `An email has been sent to ${values.email} to reset your password. Please check your inbox.`
        );
      } catch {
        setError("Error, incorrect email. Please try again.");
      }
      setLoading(false);
    },
  });
  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={formik.handleSubmit}>
          <h3 className="card-title text-center mb-4">Password Reset</h3>
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
            <label htmlFor="email">Email</label>
            <input
              className={`${
                formik.touched.email &&
                formik.errors.email &&
                "form-control is-invalid"
              } ${
                formik.touched.email && !formik.errors.email
                  ? "form-control is-valid"
                  : "form-control"
              }`}
              type="email"
              placeholder="Enter email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              Reset Password
            </button>
          </div>
          <div className="w-100 text-center">
            <Link to="/signIn">Sign in</Link>
          </div>
          <div className="w-100 text-center">
            <p>
              Don't have an account? <Link to="/signUp">Sign up</Link>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
