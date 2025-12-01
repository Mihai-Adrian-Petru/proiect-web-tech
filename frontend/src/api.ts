import axios from 'axios';
import { type Character } from './types/Character';
import { type Page } from './types/Page';

const API_URL = 'http://localhost:8080/api/characters';

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

export const getCharacters = async (page: number = 0, size: number = 10, search: string = ''): Promise<Page<Character>> => {
    const response = await axios.get<Page<Character>>(API_URL, {
        params: {
            page,
            size,
            search
        }
    });
    return response.data;
};

export const getCharacterById = async (id: number): Promise<Character> => {
    const response = await axios.get<Character>(`${API_URL}/${id}`);
    return response.data;
};


