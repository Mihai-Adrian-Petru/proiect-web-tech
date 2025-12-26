import React, { useState, useMemo } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { type Character } from "../types/Character";
import { useCharacters } from "../context/CharacterContext";
import CharacterTable from "../components/CharacterTable";

const CharacterListPage: React.FC = () => {
  const {
    characters: allCharacters,
    loading,
    error,
    refresh,
  } = useCharacters();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
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
    </Container>
  );
};

export default CharacterListPage;
