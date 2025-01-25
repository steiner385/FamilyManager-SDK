import React, { createContext, useContext } from 'react';

interface ComponentContextValue {
  components: Record<string, React.ComponentType>;
}

const ComponentContext = createContext<ComponentContextValue>({
  components: {},
});

interface ComponentProviderProps {
  children: React.ReactNode;
  components?: Record<string, React.ComponentType>;
}

export function ComponentProvider({ children, components = {} }: ComponentProviderProps) {
  return (
    <ComponentContext.Provider value={{ components }}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponents() {
  return useContext(ComponentContext);
}
