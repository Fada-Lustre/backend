export interface ChangePinRequest {
  /** Current 4-digit PIN */
  old_pin: string;
  /** New 4-digit PIN */
  new_pin: string;
  /** Must match new_pin */
  confirm_pin: string;
}

export interface ChangePinResponse {
  message: string;
}
