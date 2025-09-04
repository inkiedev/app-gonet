function formatGoWord(text: string | undefined): string | null {
  if (!text) return null
  const match = text.match(/\bGO\w*/i);
  if (!match) return null;

  const word = match[0].toLowerCase();

  const parts = [word.slice(0, 2), word.slice(2)];

  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

export {
  formatGoWord
};

