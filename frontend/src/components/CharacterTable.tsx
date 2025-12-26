import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { type Character } from "../types/Character";

interface CharacterTableProps {
  characters: Character[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (character: Character) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const CharacterTable: React.FC<CharacterTableProps> = ({
  characters,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onSearch,
  onRefresh,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div>
      <div className="mb-3 d-flex gap-2">
        <InputGroup className="flex-grow-1">
          <InputGroup.Text>Search</InputGroup.Text>
          <Form.Control
            placeholder="Search by name, nickname or portrayed..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
        <Button
          variant="outline-secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "↻ Refresh"}
        </Button>
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
              {characters.map((character) => (
                <tr key={character.id}>
                  <td>{character.id}</td>
                  <td>{character.name}</td>
                  <td>{character.nickname}</td>
                  <td>{character.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onViewDetails(character)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {characters.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No characters found
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </Table>

      {!loading && totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
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

          <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};

export default CharacterTable;
