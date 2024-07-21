import React from "react";
import { RenderedEvent } from "../../../types";

export interface CalendarEventProps {
  event: RenderedEvent;
  containerWidth: number;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  const style = {
    top: `${event.startPosition}%`,
    left: `${event.leftPosition}px`,
    width: `${event.containerWidth}px`,
    height: `${event.eventHeight}%`,
  };

  return (
    <div className="event" style={style}>
      <span style={{ color: "red", paddingRight: "10px" }}>{event.id}</span>
    </div>
  );
};

export default CalendarEvent;
