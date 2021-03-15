import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
function UpdateProfile() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: currentUser.email,
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string().when("password", {
        is: (password) => (password && password.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Passwords do not match"
        ),
      }),
    }),
    onSubmit: async (values) => {
      const promises = [];
      setError("");
      setLoading(true);
      if (values.email !== currentUser.email) {
        promises.push(updateEmail(values.email));
      }
      if (values.password) {
        promises.push(updatePassword(values.password));
      }
      Promise.all(promises)
        .then(() => {
          history.push("/");
        })
        .catch(() => {
          setError("Failed to update account");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={formik.handleSubmit}>
          <h3 className="card-title text-center mb-4">Update Profile</h3>
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
            <label htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Leave blank to keep the same password"
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
              placeholder="Leave blank to keep the same password"
              id="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              Update
            </button>
          </div>
          <div className="mb-3">
            <Link to="/">
              <button className="btn btn-danger w-100">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
