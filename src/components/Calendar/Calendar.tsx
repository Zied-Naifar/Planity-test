import React, { useState, useEffect } from "react";
import { Event } from "../../types/Calendar";
import { groupOverlappingEvents } from "../../utils/Calendar";
import CalendarEvent from "./CalendarEvent";

export interface CalendarProps {
  events: Event[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const overlappingEvents = groupOverlappingEvents(events, containerWidth);

  return (
    <div className="calendar-container">
      {overlappingEvents.map((group, index) => (
        <div key={index} className="event-group">
          {group.map((event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              containerWidth={containerWidth / group.length}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
