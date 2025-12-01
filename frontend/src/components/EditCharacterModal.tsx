import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { type Character } from '../types/Character';
import axios from 'axios';

interface EditCharacterModalProps {
    character: Character | null;
    show: boolean;
    onHide: () => void;
    onSave: () => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({ character, show, onHide, onSave }) => {
    const [formData, setFormData] = useState<Character | null>(null);

    useEffect(() => {
        if (character) {
            setFormData({ ...character });
        }
    }, [character]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'occupation' | 'appearance') => {
        if (!formData) return;
        const value = e.target.value;
        if (field === 'occupation') {
             setFormData({ ...formData, occupation: value.split(',').map(item => item.trim()) });
        } else {
             setFormData({ ...formData, appearance: value.split(',').map(item => parseInt(item.trim()) || 0) });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            await axios.put(`http://localhost:8080/api/characters/${formData.id}`, formData);
            onSave();
            onHide();
        } catch (error) {
            console.error("Failed to update character", error);
            alert("Failed to update character");
        }
    };

    if (!formData) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Character</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nickname</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="nickname" 
                                    value={formData.nickname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                >
                                    <option value="Alive">Alive</option>
                                    <option value="Deceased">Deceased</option>
                                    <option value="Presumed Dead">Presumed Dead</option>
                                    <option value="Unknown">Unknown</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="birthday" 
                                    value={formData.birthday} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Portrayed By</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="portrayed" 
                            value={formData.portrayed} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="image" 
                            value={formData.image} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Occupation (comma separated)</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.occupation.join(', ')} 
                            onChange={(e) => handleArrayChange(e as any, 'occupation')} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Seasons (comma separated numbers)</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.appearance.join(', ')} 
                            onChange={(e) => handleArrayChange(e as any, 'appearance')} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditCharacterModal;