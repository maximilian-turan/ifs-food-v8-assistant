import { motion } from 'motion/react';
import { ClipboardCheck, LogIn, ShieldCheck } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

export default function Login() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert("Login fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-black rounded-[40px] shadow-2xl shadow-primary-600/5 relative overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 p-10">
           <div className="text-6xl font-display font-black text-white/5 italic font-serif">v.8</div>
        </div>
        
        <div className="p-16 text-center md:text-left">
          <div className="inline-flex w-20 h-20 bg-primary-600 rounded-[32px] flex items-center justify-center mb-12 shadow-xl shadow-primary-600/30">
            <ClipboardCheck className="text-white w-10 h-10" />
          </div>
          
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
              IFS Food<br/>Assistant
            </h1>
            <p className="micro-label !text-primary-500">
              Compliance Intelligence Layer
            </p>
          </div>

          <p className="text-white/60 mb-14 leading-relaxed font-medium text-base text-pretty bg-white/5 p-8 rounded-3xl border border-white/5">
            DIE COMPLIANCE ENGINE FÜR AUDITS, ZERTIFIZIERUNGEN UND DIE UMSETZUNG DES AKTUELLEN IFS V8 STANDARDS.
          </p>
          
          <button 
            onClick={handleLogin}
            className="group w-full flex items-center justify-center gap-4 bg-primary-600 text-white py-6 px-10 rounded-2xl micro-label hover:bg-primary-700 transition-all active:scale-[0.98] shadow-2xl shadow-primary-600/20"
          >
            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            Mit Google anmelden
          </button>

          <div className="mt-14 flex items-center justify-center md:justify-start gap-4 text-white/20">
            <div className="w-10 h-px bg-white/10"></div>
            <ShieldCheck size={20} className="text-primary-500" />
            <span className="micro-label !text-white/40">Enterprise Security</span>
            <div className="w-10 h-px bg-white/10"></div>
          </div>
        </div>

        <div className="bg-white/5 p-10 border-t border-white/5 flex flex-col items-center">
          <p className="micro-label !text-white/20 mb-4">
            Quality Assurance Intelligence &copy; 2024
          </p>
          <div className="flex gap-4">
             <div className="w-2 h-2 bg-primary-600/50 rounded-full"></div>
             <div className="w-2 h-2 bg-primary-600/30 rounded-full"></div>
             <div className="w-2 h-2 bg-primary-600/10 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
