// this is the login form component. it handles user authentication and form validation.
// we use a separate initialState object because:
// 1. it makes the form fields reusable (DRY principle)
// 2. it's easier to reset the form to its initial state
// 3. it serves as documentation fpr what fields we expect

import React, { useState } from 'react';
import styles from './Login.module.css';
import validateLoginForm from './validateLoginForm'; // Centralized validation logic

const initialState = {
  companyCode: '',
  region: '',
  email: '',
  password: '',
};

const Login = ({ onLogin }) => {
  // we keep form state separate from errors for cleaner code and easier validation
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  // loading state prevents double submissions and shows feedback
  const [loading, setLoading] = useState(false);

  // validation is centralized in a separate file for reusability and maintainability
  const validate = () => {
    const newErrors = validateLoginForm(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // clear field-specific errors as soon as the user starts typing

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // mock login with a delay to simulate API call and show loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin(form);
    }, 900); // Mock login
  };

  return (
    <div className={styles.loginRoot}>
      <form className={styles.loginCard} onSubmit={handleSubmit} autoComplete="off">
        <div className={styles.loginTitle}>Sign In</div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="companyCode">Company Code</label>
          <input
            className={`${styles.input} ${errors.companyCode ? styles.inputError : ''}`}
            type="text"
            name="companyCode"
            id="companyCode"
            value={form.companyCode}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter company code"
          />
          {errors.companyCode && <div className={styles.errorText}>{errors.companyCode}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="region">Region</label>
          <input
            className={`${styles.input} ${errors.region ? styles.inputError : ''}`}
            type="text"
            name="region"
            id="region"
            value={form.region}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter region"
          />
          {errors.region && <div className={styles.errorText}>{errors.region}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter email"
          />
          {errors.email && <div className={styles.errorText}>{errors.email}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter password"
          />
          {errors.password && <div className={styles.errorText}>{errors.password}</div>}
        </div>
        <button
          className={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
