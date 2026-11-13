import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { KeyRound, UserCheck, AlertCircle } from 'lucide-react';
import { setRobotsDirectives } from '../../services/seo';

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { login, user, isMockMode } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  React.useEffect(() => {
    setRobotsDirectives('noindex,nofollow');
    return () => setRobotsDirectives('index,follow,max-image-preview:large');
  }, []);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setAuthError(null);
    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-green-dark flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-luxury-texture pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-left">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="font-serif text-3xl tracking-widest text-brand-gold font-bold">
            PRADNYA
          </span>
          <span className="font-sans text-[10px] tracking-[0.35em] text-brand-gold-champagne uppercase mt-1">
            Bridal Makeup Studio Management
          </span>
        </div>

        <GlassCard className="bg-brand-ivory border-brand-gold/30 shadow-2xl p-8" hoverEffect={false}>
          
          <div className="flex items-center space-x-3 mb-6 border-b border-brand-gold/15 pb-4">
            <div className="p-2 rounded-full bg-brand-green/10 text-brand-green border border-brand-gold/25">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-brand-green-dark font-bold">Admin Portal Login</h2>
              <p className="font-sans text-[11px] text-brand-charcoal/60 mt-0.5">Access studio operations dashboard</p>
            </div>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-sans text-xs">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email address is required' })}
            />

            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full justify-center py-3 bg-brand-green hover:bg-brand-green-dark border-brand-green shadow text-brand-ivory font-bold"
              loading={loading}
            >
              Sign In to Admin
            </Button>

          </form>

          {/* Help Banner if in Mock Mode */}
          {isMockMode && (
            <div className="mt-8 p-4 bg-brand-beige/40 rounded border border-brand-gold/25 text-brand-charcoal/80 text-[11px] font-sans leading-relaxed">
              <div className="flex items-center space-x-1.5 text-brand-green font-bold mb-1 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Demo Environment Active</span>
              </div>
              <p>The system is running in Mock local mode. Please use these login credentials:</p>
              <div className="mt-2 bg-brand-ivory p-2 rounded border border-brand-gold/10 font-mono space-y-0.5 text-left text-xs">
                <div>Email: <span className="font-semibold select-all">admin@pradnya.com</span></div>
                <div>Pass: <span className="font-semibold select-all">admin123</span></div>
              </div>
            </div>
          )}

        </GlassCard>

      </div>
    </div>
  );
};
export default Login;
