export const validatePassword = (password) => {
    const rules = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    const passedCount = Object.values(rules).filter(Boolean).length;

    let strength = 'Weak';
    if (passedCount >= 4 && rules.minLength) {
        strength = 'Strong';
    } else if (passedCount >= 3) {
        strength = 'Medium';
    }

    return {
        rules,
        strength,
        isValid: rules.minLength && rules.hasNumber && (rules.hasUppercase || rules.hasSpecial),
    };
};