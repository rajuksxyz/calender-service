import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "../services/api";
import "../styles/CalendarComponent.css";

const CalendarComponent = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [workingDays, setWorkingDays] = useState(null);
  const clientId = 1;

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`/calendar/${clientId}/holidays`);
      setHolidays(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const addHoliday = async () => {
    try {
      await axios.post(`/calendar/${clientId}/holidays`, {
        date: selectedDate.toISOString().split("T")[0],
        type: "HOLIDAY",
      });
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  const calculateWorkingDays = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get(`/calendar/${clientId}/working-days`, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      });
      console.log(response)
      setWorkingDays(response.data);
    } catch (error) {
      console.error("Error fetching working days:", error);
      alert("Failed to fetch working days. Please try again.");
    }
  };

  const tileClassName = ({ date, view }) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (view === "month") {
      if (isToday) {
        return "today";
      }

      if (
        holidays.some(
          (holiday) =>
            new Date(holiday.date).toDateString() === date.toDateString()
        )
      ) {
        return "holiday";
      }
    }
    return "";
  };

  return (
    <div className="calendar-layout">
      <div className="calendar-section">
        <h2>Calendar</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
        />
        <button className="btn-add-holiday" onClick={addHoliday}>
          Add Holiday
        </button>
      </div>

      <div className="info-section">
        <div className="holidays-list">
          <h3>Holidays</h3>
          <ul>
            {holidays.map((holiday, index) => (
              <li key={index}>
                {new Date(holiday.date).toLocaleDateString()} - {holiday.type}
              </li>
            ))}
          </ul>
        </div>

        <div className="working-days-section">
          <h3>Calculate Working Days</h3>
          <div className="date-picker">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </label>
          </div>
          <button className="btn-calculate" onClick={calculateWorkingDays}>
            Calculate
          </button>
          <h5>Working Days: </h5>
          {workingDays && workingDays.length  > 0 && workingDays.map((item, index) => (
            <p className="working-days-result"key={index}>
              <strong>{item}</strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
