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
        // update online to true if sign in is successful
        ref.doc(values.email).update({ online: true });
        history.push("/");
      } catch {
        setError("Failed to sign in");
      }
      setLoading(false);
    },
  });

  // sign in with google
  async function googleSignIn() {
    try {
      await signInWithGoogle();
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title" style={{ textAlign: "center" }}>
          <h3>Sign In</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
          <div>
            <button type="submit" className="buttons" disabled={loading}>
              Sign in
            </button>
          </div>
        </form>
        <div>
          <button onClick={googleSignIn} className="buttons" disabled={loading}>
            Sign in with Google
          </button>
        </div>
        <div className="sign">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>
        <div className="sign">
          <p>
            Don't have an account? <Link to="/signUp">Sign up</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
