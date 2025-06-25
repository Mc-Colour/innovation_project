// Context so all components can access the selected horse
import React, { createContext, useContext, useState } from 'react';
export const SelectedHorseContext = createContext();
export function SelectedHorseProvider({ children }) {
    const [selectedHorse, setSelectedHorse] = useState(null);

    return (
        <SelectedHorseContext.Provider value={{ selectedHorse, setSelectedHorse }}>
            {children}
        </SelectedHorseContext.Provider>
    );
}

export const useSelectedHorse = () => useContext(SelectedHorseContext); // Custom hook for easier access to context