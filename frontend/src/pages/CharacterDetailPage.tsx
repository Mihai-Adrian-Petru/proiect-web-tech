import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Button,
  Image,
  ListGroup,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { type Character } from "../types/Character";
import { getCharacterById, deleteCharacter } from "../api";
import { useUser } from "../context/UserContext";
import { useCharacters } from "../context/CharacterContext";
import EditCharacterModal from "../components/EditCharacterModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const { updateCharacterInCache, removeCharacterFromCache } = useCharacters();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
        setError("Failed to fetch character details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleEditSave = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    updateCharacterInCache(updatedCharacter);
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    if (!character) return;
    setDeleteLoading(true);
    try {
      await deleteCharacter(character.id);
      removeCharacterFromCache(character.id);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete character");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

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
        <Alert variant="danger">{error || "Character not found"}</Alert>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          &larr; Back to List
        </Button>
        {isLoggedIn && (
          <div className="d-flex gap-2">
            <Button variant="warning" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="d-flex flex-column flex-md-row gap-4">
        <div className="flex-shrink-0 text-center">
          <Image
            src={character.image}
            alt={character.name}
            thumbnail
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
        <div className="flex-grow-1">
          <h1 className="mb-3">{character.name}</h1>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Nickname:</strong> {character.nickname}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Status:</strong>{" "}
              <Badge bg={character.status === "Alive" ? "success" : "danger"}>
                {character.status}
              </Badge>
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
              <strong>Seasons:</strong> {character.appearance.join(", ")}
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>

      <EditCharacterModal
        character={character}
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSave}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        characterName={character.name}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </Container>
  );
};

export default CharacterDetailPage;
