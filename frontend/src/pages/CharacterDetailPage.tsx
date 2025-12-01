import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Button, Image, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { type Character } from '../types/Character';
import { getCharacterById } from '../api';

const CharacterDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getCharacterById(parseInt(id));
                setCharacter(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch character details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error || !character) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error || 'Character not found'}</Alert>
                <Button variant="secondary" onClick={() => navigate('/')}>Back to List</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/')}>
                &larr; Back to List
            </Button>
            
            <div className="d-flex flex-column flex-md-row gap-4">
                <div className="flex-shrink-0 text-center">
                    <Image 
                        src={character.image} 
                        alt={character.name} 
                        thumbnail 
                        style={{ maxHeight: '500px', objectFit: 'cover' }} 
                    />
                </div>
                <div className="flex-grow-1">
                    <h1 className="mb-3">{character.name}</h1>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>Nickname:</strong> {character.nickname}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Status:</strong> <Badge bg={character.status === 'Alive' ? 'success' : 'danger'}>{character.status}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Birthday:</strong> {character.birthday}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Portrayed by:</strong> {character.portrayed}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Occupation:</strong>
                            <ul className="mb-0 mt-1">
                                {character.occupation.map((job, index) => (
                                    <li key={index}>{job}</li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Seasons:</strong> {character.appearance.join(', ')}
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </div>
        </Container>
    );
};

export default CharacterDetailPage;
