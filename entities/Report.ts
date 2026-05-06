export class Report {
  protocol: string;
  is_anonymous: boolean;
  victim_name: string;
  aggressor_name?: string;
  class_grade?: string;

  constructor(
    protocol: string,
    victim_name: string,
    is_anonymous: boolean = false,
    aggressor_name?: string,
    class_grade?: string
  ) {
    this.protocol = protocol;
    this.is_anonymous = is_anonymous;
    this.victim_name = victim_name;
    this.aggressor_name = aggressor_name;
    this.class_grade = class_grade;
  }
}
