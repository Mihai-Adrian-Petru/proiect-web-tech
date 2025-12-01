package stud.etti.webtech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stud.etti.webtech.model.BreakingBadData;

@Repository
public interface BreakingBadRepository extends JpaRepository<BreakingBadData, Long> {
}


