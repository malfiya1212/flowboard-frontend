import React from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword } from '../../utils/passwordValidation';

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const { rules, strength } = validatePassword(password);

  const criteria = [
    { label: 'At least 8 characters', met: rules.minLength },
    { label: 'One uppercase letter', met: rules.hasUppercase },
    { label: 'One number', met: rules.hasNumber },
    { label: 'One special character', met: rules.hasSpecial },
  ];

  const strengthBars = {
    Weak: 1,
    Medium: 2,
    Strong: 3,
  };

  const activeBars = strengthBars[strength] || 1;

  return (
    <div className="space-y-2.5 pt-1">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider">
          <span>Password Strength</span>
          <span className="text-stone-800">{strength}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 h-1.5">
          <div
            className={`rounded-full transition-all duration-300 ${
              activeBars >= 1 ? 'bg-stone-400' : 'bg-stone-200'
            }`}
          />
          <div
            className={`rounded-full transition-all duration-300 ${
              activeBars >= 2 ? 'bg-indigo-400' : 'bg-stone-200'
            }`}
          />
          <div
            className={`rounded-full transition-all duration-300 ${
              activeBars >= 3 ? 'bg-indigo-600' : 'bg-stone-200'
            }`}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-500">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {item.met ? (
              <Check size={12} className="text-indigo-600 shrink-0" strokeWidth={3} />
            ) : (
              <X size={12} className="text-stone-300 shrink-0" strokeWidth={2} />
            )}
            <span className={item.met ? 'text-stone-800 font-medium' : 'text-stone-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}