import React, { useState, useRef } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { type Character } from "../types/Character";
import { updateCharacter } from "../api";

interface EditCharacterModalProps {
  character: Character | null;
  show: boolean;
  onHide: () => void;
  onSave: (updatedCharacter: Character) => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({
  character,
  show,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState<Character | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when character changes (without useEffect)
  const currentCharacterId = character?.id;
  const formCharacterId = formData?.id;

  if (character && currentCharacterId !== formCharacterId) {
    setFormData({ ...character });
    setImagePreview(character.image);
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "occupation" | "appearance"
  ) => {
    if (!formData) return;
    const value = e.target.value;
    if (field === "occupation") {
      setFormData({
        ...formData,
        occupation: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({
        ...formData,
        appearance: value.split(",").map((item) => parseInt(item.trim()) || 0),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const updatedCharacter = await updateCharacter(formData.id, formData);
      onSave(updatedCharacter);
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
            <Form.Label>Image</Form.Label>
            <div className="d-flex align-items-start gap-3">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  thumbnail
                  style={{ maxHeight: "100px", objectFit: "cover" }}
                />
              )}
              <div className="flex-grow-1">
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Upload a new image to replace the current one
                </Form.Text>
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Occupation (comma separated)</Form.Label>
            <Form.Control
              type="text"
              value={formData.occupation.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleArrayChange(e, "occupation")
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seasons (comma separated numbers)</Form.Label>
            <Form.Control
              type="text"
              value={formData.appearance.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleArrayChange(e, "appearance")
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditCharacterModal;
