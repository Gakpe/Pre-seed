import Script from "next/script";

// Analytics anonyme, sans cookie — zone publique uniquement.
// Inactif tant que NEXT_PUBLIC_PLAUSIBLE_DOMAIN est vide.
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
