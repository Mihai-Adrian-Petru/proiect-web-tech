package stud.etti.webtech.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stud.etti.webtech.model.Character;
import stud.etti.webtech.service.CharacterService;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
public class BreakingBadController {

    private final CharacterService characterService;

    public BreakingBadController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    public List<Character> getAllCharacters() {
        return characterService.getAllCharacters();
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
