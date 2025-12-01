package stud.etti.webtech.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import stud.etti.webtech.model.BreakingBadData;
import stud.etti.webtech.model.Character;
import stud.etti.webtech.repository.BreakingBadRepository;
import stud.etti.webtech.utils.CharacterMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacterService {

    private final BreakingBadRepository repository;
    private final CharacterMapper mapper;

    public CharacterService(BreakingBadRepository repository, CharacterMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<Character> getCharacters(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            Page<BreakingBadData> dataPage = repository.findAll(pageable);
            return dataPage.map(mapper::toCharacter);
        }

        List<Character> allCharacters = repository.findAll().stream()
                .map(mapper::toCharacter)
                .filter(character -> matchesQuery(character, query.trim()))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allCharacters.size());

        if (start > allCharacters.size()) {
            return new PageImpl<>(List.of(), pageable, allCharacters.size());
        }

        List<Character> pagedCharacters = allCharacters.subList(start, end);
        return new PageImpl<>(pagedCharacters, pageable, allCharacters.size());
    }

    private boolean matchesQuery(Character character, String query) {
        String lowerQuery = query.toLowerCase();
        return (character.getName() != null && character.getName().toLowerCase().contains(lowerQuery)) ||
               (character.getNickname() != null && character.getNickname().toLowerCase().contains(lowerQuery)) ||
               (character.getPortrayed() != null && character.getPortrayed().toLowerCase().contains(lowerQuery));
    }

    public Character getCharacterById(Long id) {
        return repository.findById(id)
                .map(mapper::toCharacter)
                .orElse(null);
    }

    public Character updateCharacter(Long id, Character updatedCharacter) {
        return repository.findById(id).map(existingData -> {
            java.util.Map<String, Object> data = existingData.getData();
            data.put("name", updatedCharacter.getName());
            data.put("birthday", updatedCharacter.getBirthday());
            data.put("occupation", updatedCharacter.getOccupation());
            data.put("status", updatedCharacter.getStatus());
            data.put("nickname", updatedCharacter.getNickname());
            data.put("portrayed", updatedCharacter.getPortrayed());
            data.put("appearance", updatedCharacter.getAppearance());
            data.put("image", updatedCharacter.getImage());
            
            existingData.setData(data);
            BreakingBadData savedData = repository.save(existingData);
            return mapper.toCharacter(savedData);
        }).orElse(null);
    }

    public void deleteCharacter(Long id) {
        repository.deleteById(id);
    }
}
