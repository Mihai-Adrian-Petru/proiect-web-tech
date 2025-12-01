package stud.etti.webtech.utils;

import org.springframework.stereotype.Component;
import stud.etti.webtech.model.BreakingBadData;
import stud.etti.webtech.model.Character;

import java.util.List;
import java.util.Map;

@Component
public class CharacterMapper {

    @SuppressWarnings("unchecked")
    public Character toCharacter(BreakingBadData data) {
        if (data == null || data.getData() == null) {
            return null;
        }

        Map<String, Object> properties = data.getData();
        Character character = new Character();
        character.setId(data.getId());
        character.setName((String) properties.get("name"));
        character.setBirthday((String) properties.get("birthday"));
        character.setOccupation((List<String>) properties.get("occupation"));
        character.setStatus((String) properties.get("status"));
        character.setNickname((String) properties.get("nickname"));
        character.setPortrayed((String) properties.get("portrayed"));
        character.setAppearance((List<Integer>) properties.get("appearance"));
        character.setImage((String) properties.get("image"));

        return character;
    }
}
