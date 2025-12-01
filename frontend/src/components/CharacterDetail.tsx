import React from 'react';
import { Modal, Button, Image, ListGroup, Badge } from 'react-bootstrap';
import { type Character } from '../types';

interface CharacterDetailProps {
    character: Character | null;
    show: boolean;
    onHide: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, show, onHide }) => {
    if (!character) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{character.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column flex-md-row gap-4">
                    <div className="flex-shrink-0 text-center">
                        <Image 
                            src={character.image} 
                            alt={character.name} 
                            thumbnail 
                            style={{ maxHeight: '400px', objectFit: 'cover' }} 
                        />
                    </div>
                    <div className="flex-grow-1">
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CharacterDetail;
