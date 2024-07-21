import { Event, RenderedEvent } from "../types/Calendar";

const getTimeInMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

export const getEventStartTime = (event: Event): number =>
  getTimeInMinutes(event.start);

export const getEventEndTime = (event: Event): number => {
    const start = getEventStartTime(event);
    const endHour = Math.floor((start + event.duration) / 60);
    const endMinute = (start + event.duration) % 60;
    return endHour * 60 + endMinute;
  };
  
export const isOverlapping = (event1: Event, event2: Event): boolean => {
  const event1Start = getEventStartTime(event1);
  const event1End = getEventEndTime(event1);
  const event2Start = getEventStartTime(event2);
  const event2End = getEventEndTime(event2);

  return (
    (event1Start < event2End && event1End > event2Start) ||
    (event2Start < event1End && event2End > event1Start)
  );
};

export const reshapeEvent = (event: Event): RenderedEvent => {
    const startMinutes = getTimeInMinutes(event.start);
    const startPosition = Math.floor(((startMinutes - 540) / 720) * 100); // 540 = 9*60, 720 = 12*60
  
    const endMinutes = startMinutes + event.duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
  
    const end = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
    const eventHeight = Math.floor((event.duration / 720) * 100);
  
    return {
      ...event,
      end,
      startPosition,
      eventHeight,
    };
  };

export const getOverlappingGroup = (
  groupedEvents: RenderedEvent[][],
  event: RenderedEvent
): RenderedEvent[] | undefined => {
  return groupedEvents.find((group) =>
    group.some((groupEvent) => isOverlapping(event, groupEvent))
  );
};

export const calculateContainerWidth = (
    containerWidth: number,
    overlappingGroup: RenderedEvent[]
  ): number => {
    if (overlappingGroup.length === 0) return containerWidth;
  
    let nonOverlappingCount = 1;
  
    for (let i = 1; i < overlappingGroup.length; i++) {
      if (!isOverlapping(overlappingGroup[i - 1], overlappingGroup[i])) {
        nonOverlappingCount++;
      }
    }
  
    const totalEvents = overlappingGroup.length - nonOverlappingCount + 1;
    return containerWidth / totalEvents;
  };
  

  export const calculateLeftPosition = (
    eventWidth: number,
    index: number,
    overlappingGroup: RenderedEvent[]
  ): number => {
    if (index === 0) return 0;
  
    const currentEvent = overlappingGroup[index];
    const prevEvent = overlappingGroup[index - 1];
  
    return isOverlapping(prevEvent, currentEvent) ? eventWidth * index : eventWidth * (index - 1);
  };
  
export const groupOverlappingEvents = (
  events: Event[],
  containerWidth: number
): RenderedEvent[][] => {
  const orderedEvents = events.sort(
    (a, b) => getEventStartTime(a) - getEventStartTime(b)
  );

  return orderedEvents.reduce(
    (groupedEvents: RenderedEvent[][], event: Event) => {
      const reshapedEvent = reshapeEvent(event);

      const overlappingGroup = getOverlappingGroup(
          groupedEvents,
          reshapedEvent
        );
        console.log('overlappingGroup: ', overlappingGroup);

      if (overlappingGroup) {
        overlappingGroup.push(reshapedEvent);

        const containerWidthResult = calculateContainerWidth(
          containerWidth,
          overlappingGroup
        );

        const updatedGroup = overlappingGroup.map((groupEvent, i) => ({
          ...groupEvent,
          containerWidth: containerWidthResult,
          leftPosition: calculateLeftPosition(
            containerWidthResult,
            i,
            overlappingGroup
          ),
        }));

        groupedEvents[groupedEvents.indexOf(overlappingGroup)] = updatedGroup;
      } else {
        groupedEvents.push([
          {
            ...reshapedEvent,
            containerWidth,
            leftPosition: 0,
          },
        ]);
      }

      return groupedEvents;
    },
    []
  );
};
