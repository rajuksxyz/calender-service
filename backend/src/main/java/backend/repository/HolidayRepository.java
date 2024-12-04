package backend.repository;

import backend.entity.Holiday;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayRepository extends CrudRepository<Holiday, Long> {
    List<Holiday> findByClientId(Long clientId);
    List<Holiday> findByClientIdAndDateBetween(Long clientId, LocalDate startDate, LocalDate endDate);
}
