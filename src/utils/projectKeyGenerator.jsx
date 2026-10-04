/**
 * Generates an uppercase Jira-style project key from a project name
 * Examples:
 *   "FlowBoard Core" -> "FC"
 *   "Infrastructure" -> "INFRA"
 *   "Mobile App iOS" -> "MAI"
 */
export function generateProjectKey(name) {
  if (!name || typeof name !== 'string') return '';

  const clean = name.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length === 0) return '';

  if (words.length === 1) {
    // Single word: take up to first 5 letters
    return words[0].substring(0, 5).toUpperCase();
  }

  if (words.length <= 4) {
    // 2 to 4 words: take first letter of each word
    const initials = words.map((w) => w[0]).join('').toUpperCase();
    return initials.length < 2 ? `${initials}X` : initials;
  }

  // More than 4 words: first 4 initials
  return words.slice(0, 4).map((w) => w[0]).join('').toUpperCase();
}

/**
 * Validates Jira project key syntax: 2 to 10 uppercase letters or numbers, starting with a letter.
 */
export function validateProjectKey(key) {
  const regex = /^[A-Z][A-Z0-9]{1,9}$/;
  return regex.test(key);
}