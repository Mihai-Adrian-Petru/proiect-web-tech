package stud.etti.webtech.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stud.etti.webtech.model.Character;
import stud.etti.webtech.service.CharacterService;

@RestController
@RequestMapping("/api/characters")
public class BreakingBadController {

    private final CharacterService characterService;

    public BreakingBadController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    public Page<Character> getAllCharacters(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return characterService.getCharacters(search, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Character> getCharacterById(@PathVariable Long id) {
        Character character = characterService.getCharacterById(id);
        if (character != null) {
            return ResponseEntity.ok(character);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Character> updateCharacter(@PathVariable Long id, @RequestBody Character character) {
        Character updatedCharacter = characterService.updateCharacter(id, character);
        if (updatedCharacter != null) {
            return ResponseEntity.ok(updatedCharacter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id);
        return ResponseEntity.noContent().build();
    }
}

