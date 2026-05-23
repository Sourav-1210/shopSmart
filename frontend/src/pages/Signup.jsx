import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const Signup = () => {
  const { register, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await register(form.name, form.email, form.password, form.phone);
    if (success) navigate(from, { replace: true });
  };

  const inputClass = (field) =>
    `w-full border rounded-lg pl-9 pr-4 py-3 text-sm outline-none transition-all ${
      errors[field]
        ? 'border-red-400 bg-red-50 focus:border-red-400'
        : 'border-gray-200 focus:border-flipkart-blue focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <div className="min-h-screen bg-flipkart-gray flex items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-flipkart-blue to-blue-900 p-10 w-80 flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Looks like you're new here!
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Sign up with your email to get started. Enjoy exclusive deals, track orders, and save your wishlist.
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-white/60 text-xs">Join millions of happy shoppers</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 bg-white p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-flipkart-darkgray">Create your account</h3>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass('name')}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass('email')}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={inputClass('phone')}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`${inputClass('password')} pr-10`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`${inputClass('confirmPassword')} pr-10`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPassword}</p>}
            </div>

            <p className="text-xs text-gray-400">
              By creating an account, you agree to ShopSmart's{' '}
              <span className="text-flipkart-blue cursor-pointer hover:underline">Terms of Use</span> and{' '}
              <span className="text-flipkart-blue cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-flipkart-orange text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-all shadow-md disabled:opacity-60 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-flipkart-blue font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
