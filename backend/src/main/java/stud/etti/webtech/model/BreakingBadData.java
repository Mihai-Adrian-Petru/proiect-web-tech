package stud.etti.webtech.model;

import jakarta.persistence.*;
import lombok.Data;
import stud.etti.webtech.utils.JsonConverter;

import java.util.Map;

@Entity
@Table(name = "data")
@Data
public class BreakingBadData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> data;
}
