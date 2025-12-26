import axios from "axios";
import { type Character } from "./types/Character";

const API_URL = "http://localhost:8080/api/characters";

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

export const getCharacters = async (): Promise<Character[]> => {
  const response = await axios.get<Character[]>(API_URL);
  return response.data;
};

export const getCharacterById = async (id: number): Promise<Character> => {
  const response = await axios.get<Character>(`${API_URL}/${id}`);
  return response.data;
};

export const updateCharacter = async (
  id: number,
  character: Character
): Promise<Character> => {
  const response = await axios.put<Character>(`${API_URL}/${id}`, character);
  return response.data;
};

export const deleteCharacter = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
