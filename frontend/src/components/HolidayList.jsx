import React from "react";
import "../styles/HolidayList.css";

const HolidayList = ({ holidays, removeHoliday }) => {
  return (
    <div className="holiday-list">
      <h2>Holidays</h2>
      <ul>
        {holidays.map((holiday) => (
          <li key={holiday.id}>
            {new Date(holiday.date).toDateString()} - {holiday.type}
            <button
              onClick={() => removeHoliday(holiday.id)}
              className="btn-remove"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayList;
