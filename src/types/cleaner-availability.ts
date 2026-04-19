export type AvailabilityMode = "every_day" | "weekdays" | "weekends" | "custom";

export interface DaySchedule {
  accept: boolean;
  start?: string;
  end?: string;
}

export interface AvailabilitySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface AvailabilityResponse {
  mode: string;
  schedule: AvailabilitySchedule;
  accept_bookings: boolean;
}

export interface UpdateAvailabilityRequest {
  mode: AvailabilityMode;
  schedule: AvailabilitySchedule;
  accept_bookings?: boolean;
}
