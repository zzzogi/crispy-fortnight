"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// Context type
export type CategoryType = {
  slug: string;
  setSlug: (slug: string) => void;
};

// Create the context with default values
const CategoryContext = createContext<CategoryType>({
  slug: "",
  setSlug: () => {}, // default empty function
});

// Hook for using the context
export const useCategoryContext = () => useContext(CategoryContext);

// Provider component
export function CategoryProvider({
  children,
  initialSlug = "",
}: {
  children: ReactNode;
  initialSlug: string;
}) {
  const [slug, setSlug] = useState<string>(initialSlug);

  return (
    <CategoryContext.Provider value={{ slug, setSlug }}>
      {children}
    </CategoryContext.Provider>
  );
}
