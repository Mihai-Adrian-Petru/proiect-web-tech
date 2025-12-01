package stud.etti.webtech.model;

import lombok.Data;

import java.util.List;

@Data
public class Character {
    private Long id;
    private String name;
    private String birthday;
    private List<String> occupation;
    private String status;
    private String nickname;
    private String portrayed;
    private List<Integer> appearance;
    private String image;
}
