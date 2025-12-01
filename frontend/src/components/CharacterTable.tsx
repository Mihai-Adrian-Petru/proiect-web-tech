import React, { useState } from 'react';
import { Table, Pagination, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { type Character } from "../types/Character";
import { useUser } from '../context/UserContext';
import axios from 'axios';

interface CharacterTableProps {
    characters: Character[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewDetails: (character: Character) => void;
    onEdit: (character: Character) => void;
    onSearch: (query: string) => void;
    loading: boolean;
}

const CharacterTable: React.FC<CharacterTableProps> = ({ 
    characters, 
    currentPage, 
    totalPages, 
    onPageChange, 
    onViewDetails,
    onEdit,
    onSearch,
    loading
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    const isAdmin = user?.roles?.some((role: any) => role.authority === 'ROLE_ADMIN');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            try {
                await axios.delete(`http://localhost:8080/api/characters/${id}`);
                // Trigger refresh by calling onSearch with current term (or a refresh callback)
                onSearch(searchTerm); 
            } catch (error) {
                console.error("Failed to delete character", error);
                alert("Failed to delete character");
            }
        }
    };

    return (
        <div>
            <div className="mb-3">
                <InputGroup>
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control 
                        placeholder="Search by name, nickname or portrayed..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Nickname</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center py-5">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </td>
                        </tr>
                    ) : (
                        <>
                            {characters.map(character => (
                                <tr key={character.id}>
                                    <td>{character.id}</td>
                                    <td>{character.name}</td>
                                    <td>{character.nickname}</td>
                                    <td>{character.status}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                onClick={() => onViewDetails(character)}
                                            >
                                                View
                                            </Button>
                                            {isAdmin && (
                                                <>
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm" 
                                                        onClick={() => onEdit(character)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(character.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {characters.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center">No characters found</td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </Table>

            {!loading && totalPages > 1 && (
                <Pagination className="justify-content-center">
                    <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                    
                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        // Show limited page numbers for better UI if many pages
                        if (
                            page === 1 || 
                            page === totalPages || 
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                            return (
                                <Pagination.Item 
                                    key={page} 
                                    active={page === currentPage}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </Pagination.Item>
                            );
                        } else if (
                            (page === currentPage - 3 && currentPage > 4) || 
                            (page === currentPage + 3 && currentPage < totalPages - 3)
                        ) {
                            return <Pagination.Ellipsis key={`ellipsis-${page}`} />;
                        }
                        return null;
                    })}

                    <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            )}
        </div>
    );
};

export default CharacterTable;
