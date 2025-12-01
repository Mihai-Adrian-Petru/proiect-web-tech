import React, { useEffect, useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { type Character } from '../types/Character';
import { getCharacters } from '../api';
import CharacterTable from '../components/CharacterTable';
import EditCharacterModal from '../components/EditCharacterModal';

const CharacterListPage: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getCharacters(currentPage - 1, 10, searchQuery);
                setCharacters(data.content);
                setTotalPages(data.totalPages);
                setLoading(false);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch characters. Please ensure the backend is running.');
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery, refreshKey]);

    const handleViewDetails = (character: Character) => {
        navigate(`/characters/${character.id}`);
    };

    const handleEdit = (character: Character) => {
        setCharacterToEdit(character);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCharacterToEdit(null);
    };

    const handleSaveEdit = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <Container className="py-5">
            {error && <Alert variant="danger">{error}</Alert>}

            {!error && (
                <CharacterTable 
                    characters={characters} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onSearch={handleSearch}
                    loading={loading}
                />
            )}

            <EditCharacterModal 
                character={characterToEdit} 
                show={showEditModal} 
                onHide={handleCloseEditModal} 
                onSave={handleSaveEdit}
            />
        </Container>
    );
};

export default CharacterListPage;
