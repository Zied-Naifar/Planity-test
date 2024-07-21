export interface Event {
  id: number;
  start: string;
  duration: number;
}

export interface RenderedEvent extends Event {
  end?: string;
  containerWidth?: number;
  startPosition?: number;
  leftPosition?: number;
  eventHeight?: number;
}
