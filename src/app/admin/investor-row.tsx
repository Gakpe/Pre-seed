"use client";

import { useRouter } from "next/navigation";

// Ligne d'investisseur cliquable dans son entier.
//
// Un lien étiré ne convient pas ici : la ligne porte déjà deux formulaires
// (niveau 2, blocage), et un <a> en couverture les rendrait inatteignables.
// D'où la navigation au clic, en laissant passer les clics qui visent une
// action de la ligne.
//
// Le nom reste un vrai lien : c'est lui qui porte l'accès clavier et le rôle
// pour un lecteur d'écran, une ligne de tableau ne pouvant pas les porter.
export function InvestorRow({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <tr
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a, button, form, input, label, select")) return;
        // Sélectionner du texte ne doit pas déclencher la navigation.
        if (window.getSelection()?.toString()) return;
        router.push(href);
      }}
      className="cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
    >
      {children}
    </tr>
  );
}
