import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { type Character } from "../types/Character";
import { getCharacters } from "../api";

interface CharacterContextType {
  characters: Character[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateCharacterInCache: (updatedCharacter: Character) => void;
  removeCharacterFromCache: (id: number) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCharacters();
      setCharacters(data);
      setError(null);
      setInitialized(true);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to fetch characters. Please ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on first access if not initialized
  const ensureInitialized = useCallback(async () => {
    if (!initialized && !loading) {
      await refresh();
    }
  }, [initialized, loading, refresh]);

  // Call ensureInitialized when provider mounts
  React.useEffect(() => {
    ensureInitialized();
  }, [ensureInitialized]);

  const updateCharacterInCache = useCallback((updatedCharacter: Character) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === updatedCharacter.id ? updatedCharacter : c))
    );
  }, []);

  const removeCharacterFromCache = useCallback((id: number) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      characters,
      loading,
      error,
      refresh,
      updateCharacterInCache,
      removeCharacterFromCache,
    }),
    [
      characters,
      loading,
      error,
      refresh,
      updateCharacterInCache,
      removeCharacterFromCache,
    ]
  );

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCharacters = (): CharacterContextType => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacters must be used within a CharacterProvider");
  }
  return context;
};
