import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { customToast } from '../components/ToastProvider';
import { useAuth } from '../contexts/AuthContext';
import { Search, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

export function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // Login validation
  const validateLogin = () => {
    const errors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Register validation
  const validateRegister = () => {
    const errors: Record<string, string> = {};

    if (!registerData.name.trim()) {
      errors.name = 'Name is required';
    } else if (registerData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateLogin()) {
      setIsSubmitting(true);
      try {
        await login(loginData.email, loginData.password);
        customToast.success('Login Successful!', 'Welcome back to FLIRT.');
        navigate('/');
      } catch (error: any) {
        customToast.error('Login Failed', error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      customToast.error('Form Validation Failed', 'Please fix the errors in the form');
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateRegister()) {
      setIsSubmitting(true);
      try {
        await register(registerData.name, registerData.email, registerData.password);
        customToast.success('Registration Successful!', 'Please check your email to verify your account.');
        setActiveTab('login');
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: any) {
        customToast.error('Registration Failed', error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      customToast.error('Form Validation Failed', 'Please fix the errors in the form');
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: 'Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Fair', color: 'bg-orange-500' },
      { strength: 3, label: 'Good', color: 'bg-yellow-500' },
      { strength: 4, label: 'Strong', color: 'bg-green-500' },
      { strength: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];

    return levels.find(l => l.strength === strength) || levels[0];
  };

  const currentStrength = passwordStrength(registerData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-slate-100 flex items-center justify-center p-4 pb-24 md:pb-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity" aria-label="Go to FLIRT home page">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-xl" aria-hidden="true">
              <Search className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-semibold text-foreground">FLIRT</span>
          </Link>
          <p className="text-muted-foreground">
            Finding and Locating lost Items to Return to Their rightful owners
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-6 md:p-8 shadow-2xl bg-white/95 backdrop-blur-sm border-2 border-blue-100">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-50 p-1 h-auto">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg py-3 transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg py-3 transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <h2 className="mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground text-sm">
                    Login to access your FLIRT account
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-base">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@ccis.edu"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        setLoginErrors({ ...loginErrors, email: '' });
                      }}
                      className={`pl-11 h-12 rounded-xl border-2 ${
                        loginErrors.email 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {loginErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        setLoginErrors({ ...loginErrors, password: '' });
                      }}
                      className={`pl-11 pr-11 h-12 rounded-xl border-2 ${
                        loginErrors.password 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {loginErrors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Login to FLIRT
                </Button>

                {/* Demo Account */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-muted-foreground text-center">
                    Demo: admin@ccis.edu / password123
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <h2 className="mb-2">Create Account</h2>
                  <p className="text-muted-foreground text-sm">
                    Join FLIRT to help reunite lost items
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-base">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, name: e.target.value });
                        setRegisterErrors({ ...registerErrors, name: '' });
                      }}
                      className={`pl-11 h-12 rounded-xl border-2 ${
                        registerErrors.name 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {registerErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-base">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@ccis.edu"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, email: e.target.value });
                        setRegisterErrors({ ...registerErrors, email: '' });
                      }}
                      className={`pl-11 h-12 rounded-xl border-2 ${
                        registerErrors.email 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {registerErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, password: e.target.value });
                        setRegisterErrors({ ...registerErrors, password: '' });
                      }}
                      className={`pl-11 pr-11 h-12 rounded-xl border-2 ${
                        registerErrors.password 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${currentStrength.color}`}
                            style={{ width: `${(currentStrength.strength / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{currentStrength.label}</span>
                      </div>
                    </div>
                  )}
                  {registerErrors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {registerErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-base">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, confirmPassword: e.target.value });
                        setRegisterErrors({ ...registerErrors, confirmPassword: '' });
                      }}
                      className={`pl-11 pr-11 h-12 rounded-xl border-2 ${
                        registerErrors.confirmPassword 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : 'border-blue-200 focus-visible:border-primary focus-visible:ring-primary/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerData.confirmPassword && 
                   registerData.password === registerData.confirmPassword && 
                   !registerErrors.confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Passwords match
                    </p>
                  )}
                  {registerErrors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90"
                >
                  <User className="w-4 h-4 mr-2" />
                  Create Account
                </Button>

                {/* Terms */}
                <p className="text-xs text-muted-foreground text-center">
                  By registering, you agree to our{' '}
                  <button type="button" className="text-primary hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}