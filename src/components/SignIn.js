import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import app from "../firebase";

function SignIn() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const history = useHistory();
  // db ref
  const ref = app.firestore().collection("Users");

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
      try {
        setError("");
        setLoading(true);
        // sign a user in with email and password
        await signIn(values.email, values.password);
        history.push("/");
      } catch {
        setError("Failed to sign in");
      }

      // update online to true if sign in is successful
      ref.doc(values.email).update({ online: true });

      setLoading(false);
    },
  });

  // // sign in with google
  // async function googleSignIn() {
  //   try {
  //     await signInWithGoogle();
  //     history.push("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Sign In</h3>
        <form onSubmit={formik.handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
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
            <label htmlFor="loginPassword">Password</label>
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
          <div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="w-100 text-center mt-2">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>
        <div className="w-100 text-center mt-2">
          <p>
            Don't have an account? <Link to="/signUp">Sign up</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
