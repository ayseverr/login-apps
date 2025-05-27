// Centralized validation logic for the Login form.
export default function validateLoginForm(form) {
  const errors = {};
  if (!form.companyCode.trim()) errors.companyCode = 'Company code is required.';
  if (!form.region.trim()) errors.region = 'Region is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Invalid email format.';
  if (!form.password.trim()) errors.password = 'Password is required.';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
} 