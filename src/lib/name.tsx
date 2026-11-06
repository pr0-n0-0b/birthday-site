import { createContext, useContext, useState, type ReactNode } from "react";

type NameCtx = {
  name: string;
  setName: (n: string) => void;
};

const HerNameContext = createContext<NameCtx>({ name: "Her", setName: () => {} });

export function HerNameProvider({ children }: { children: ReactNode }) {
  const [name, setNameRaw] = useState<string>(() => {
    try {
      return localStorage.getItem("her-name") || "Her";
    } catch {
      return "Her";
    }
  });

  const setName = (n: string) => {
    const clean = n.trim().slice(0, 24) || "Her";
    setNameRaw(clean);
    try {
      localStorage.setItem("her-name", clean);
    } catch {
      /* private mode */
    }
  };

  return <HerNameContext.Provider value={{ name, setName }}>{children}</HerNameContext.Provider>;
}

export const useHer = () => useContext(HerNameContext);
