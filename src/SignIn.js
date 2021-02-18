import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./AuthContext";
import { Link, useHistory } from "react-router-dom";
function SignIn() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("form data", values);
      try {
        setError("");
        setLoading(true);
        await signIn(values.email, values.password);
        history.push("/");
      } catch {
        setError("Failed to sign in");
      }
      setLoading(false);
    },
  });
  return (
    <div className="card">
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="heading">
            <h3>Sign in</h3>
          </div>
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
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
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
          <button type="submit" className="buttons" disabled={loading}>
            Sign in
          </button>
          <div className="sign">
            <Link to="/forgotPassword">Forgot Password?</Link>
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

export default SignIn;
