import React, { useState, useMemo } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { type Character } from "../types/Character";
import { useCharacters } from "../context/CharacterContext";
import CharacterTable from "../components/CharacterTable";
import AddCharacterModal from "../components/AddCharacterModal";
import { useUser } from "../context/UserContext";

const CharacterListPage: React.FC = () => {
  const {
    characters: allCharacters,
    loading,
    error,
    refresh,
  } = useCharacters();
  const { isLoggedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const pageSize = 10;

  const navigate = useNavigate();

  // Client-side filtering
  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCharacters;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return allCharacters.filter(
      (character) =>
        character.name?.toLowerCase().includes(lowerQuery) ||
        character.nickname?.toLowerCase().includes(lowerQuery) ||
        character.portrayed?.toLowerCase().includes(lowerQuery)
    );
  }, [allCharacters, searchQuery]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredCharacters.length / pageSize);
  const paginatedCharacters = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCharacters.slice(start, start + pageSize);
  }, [filteredCharacters, currentPage, pageSize]);

  const handleViewDetails = (character: Character) => {
    navigate(`/characters/${character.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRefresh = () => {
    refresh();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {isLoggedIn && (
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => setShowAddModal(true)}
            disabled={loading}
          >
            + Add Character
          </Button>
        </div>
      )}

      {!error && (
        <CharacterTable
          characters={paginatedCharacters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          loading={loading}
        />
      )}

      <AddCharacterModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onCreated={async () => {
          await refresh();
        }}
      />
    </Container>
  );
};

export default CharacterListPage;
