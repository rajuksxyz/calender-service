package backend.controller;

import backend.entity.Client;
import backend.repository.ClientRepository;
import io.micronaut.http.annotation.*;
import backend.entity.Holiday;
import backend.repository.HolidayRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Controller("/calendar")
public class CalendarController {

	private final HolidayRepository holidayRepository;
	private final ClientRepository clientRepository;

	public CalendarController(HolidayRepository holidayRepository, ClientRepository clientRepository) {
		this.holidayRepository = holidayRepository;
		this.clientRepository = clientRepository;
	}

	@Post("/{clientId}/holidays")
	public Holiday addHoliday(@PathVariable Long clientId, @Body Holiday holiday) {
		Client client = clientRepository.findById(clientId)
				.orElseThrow(() -> new IllegalArgumentException("Client not found with id: " + clientId));
		holiday.setClient(client);
		return holidayRepository.save(holiday);
	}

	@Get("/{clientId}/holidays")
	public List<Holiday> getHolidays(@PathVariable Long clientId) {
		return holidayRepository.findByClientId(clientId);
	}

	@Delete("/{clientId}/holidays/{holidayId}")
	public void removeHoliday(@PathVariable Long clientId, @PathVariable Long holidayId) {
		holidayRepository.deleteById(holidayId);
	}

	@Get("/{clientId}/working-days")
	public List<LocalDate> getWorkingDays(@PathVariable Long clientId, @QueryValue LocalDate startDate, @QueryValue LocalDate endDate) {
		List<Holiday> holidays = holidayRepository.findByClientIdAndDateBetween(clientId, startDate, endDate);
		List<LocalDate> allDates = startDate.datesUntil(endDate.plusDays(1)).collect(Collectors.toList());
		holidays.forEach(holiday -> allDates.remove(holiday.getDate()));
		return allDates;
	}

	@Post("/clients")
	public Client addClient(@Body Client client) {
		if (client.getHolidays() != null) {
			client.getHolidays().forEach(holiday -> holiday.setClient(client));
		}
		return clientRepository.save(client);
	}
}
