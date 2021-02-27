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
          `An email has been sent to ${values.email}. Check your inbox.`
        );
      } catch {
        setError("Failed to reset password");
      }
      setLoading(false);
    },
  });
  return (
    <div className="card">
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="heading">
            <h3>Password Reset</h3>
          </div>
          <div>{message && <div className="successMsg">{message}</div>}</div>
          <div>{error && <div className="errorMsg">{error}</div>}</div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
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

          <button type="submit" className="buttons" disabled={loading}>
            Reset Password
          </button>
          <div className="sign">
            <Link to="/signIn">Sign in</Link>
          </div>
          <div className="sign">
            <p>
              Don't have an account? <Link to="/signUp">Sign up</Link>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
