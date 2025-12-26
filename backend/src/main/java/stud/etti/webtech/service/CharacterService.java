package stud.etti.webtech.service;

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

    public List<Character> getAllCharacters() {
        return repository.findAll().stream()
                .map(mapper::toCharacter)
                .collect(Collectors.toList());
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
