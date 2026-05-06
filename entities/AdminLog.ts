export class AdminLog {
  admin_email: string;
  action: string;
  description: string;
  report_protocol?: string;

  constructor(
    admin_email: string,
    action: string,
    description: string,
    report_protocol?: string
  ) {
    this.admin_email = admin_email;
    this.action = action;
    this.description = description;
    this.report_protocol = report_protocol;
  }
}
