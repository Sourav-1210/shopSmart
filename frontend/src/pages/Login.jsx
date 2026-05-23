import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // Already logged in → redirect
  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(form.email, form.password);
    if (success) navigate(from, { replace: true });
  };

  const fillDemo = () => {
    setForm({ email: 'rahul.sharma@example.com', password: 'password123' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-flipkart-gray flex items-center justify-center px-4">
      <div className="flex w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-flipkart-blue to-blue-900 p-10 w-80 flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Login
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Get access to your Orders, Wishlist and personalized Recommendations.
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-white/60 text-xs">India's Best Online Shopping</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 bg-white p-8">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-flipkart-darkgray">Sign in to ShopSmart</h3>
            <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  placeholder="Enter your email"
                  className={`w-full border rounded-lg pl-9 pr-4 py-3 text-sm outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-flipkart-blue focus:ring-2 focus:ring-blue-100'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  placeholder="Enter your password"
                  className={`w-full border rounded-lg pl-9 pr-10 py-3 text-sm outline-none transition-all ${errors.password ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-flipkart-blue focus:ring-2 focus:ring-blue-100'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.password}</p>}
            </div>

            <p className="text-xs text-gray-400">
              By continuing, you agree to ShopSmart's{' '}
              <span className="text-flipkart-blue cursor-pointer hover:underline">Terms of Use</span> and{' '}
              <span className="text-flipkart-blue cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            {/* Login button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-flipkart-orange text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-all shadow-md disabled:opacity-60 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Logging in...</>
              ) : 'Login'}
            </button>

            {/* Demo button */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full border-2 border-flipkart-blue text-flipkart-blue font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              🧪 Use Demo Account
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">Demo Credentials</p>
            <p className="text-xs text-blue-600 mt-0.5">📧 rahul.sharma@example.com</p>
            <p className="text-xs text-blue-600">🔑 password123</p>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              New to ShopSmart?{' '}
              <Link to="/signup" className="text-flipkart-blue font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
