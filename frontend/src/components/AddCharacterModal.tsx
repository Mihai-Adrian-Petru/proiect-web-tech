import React, { useState, useRef } from "react";
import { Modal, Button, Form, Row, Col, Image, Alert } from "react-bootstrap";
import { createCharacter, type CreateCharacterRequest } from "../api";

interface AddCharacterModalProps {
  show: boolean;
  onHide: () => void;
  onCreated: () => void;
}

const emptyForm: CreateCharacterRequest = {
  name: "",
  birthday: "",
  occupation: [],
  status: "Alive",
  nickname: "",
  portrayed: "",
  appearance: [],
  image: "",
};

const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  show,
  onHide,
  onCreated,
}) => {
  const [formData, setFormData] = useState<CreateCharacterRequest>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFormData(emptyForm);
    setImagePreview("");
    setSubmitting(false);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetState();
    onHide();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "occupation" | "appearance"
  ) => {
    const value = e.target.value;
    if (field === "occupation") {
      setFormData((prev) => ({
        ...prev,
        occupation: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        appearance: value
          .split(",")
          .map((item) => parseInt(item.trim(), 10))
          .filter((n) => !Number.isNaN(n)),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.nickname.trim() || !formData.portrayed.trim()) {
      setError("Please fill in Name, Nickname, and Portrayed By.");
      return;
    }

    setSubmitting(true);
    try {
      await createCharacter(formData);
      onCreated();
      handleClose();
    } catch (err) {
      console.error("Failed to create character", err);
      setError("Failed to create character. Are you logged in as admin?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Character</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

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
                  Optional: upload an image (stored as base64).
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
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="success" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCharacterModal;
