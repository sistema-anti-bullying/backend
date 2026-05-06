export class InternalNote {
  report_id: string;
  content: string;
  author_name?: string;
  author_email?: string;

  constructor(
    report_id: string,
    content: string,
    author_name?: string,
    author_email?: string
  ) {
    this.report_id = report_id;
    this.content = content;
    this.author_name = author_name;
    this.author_email = author_email;
  }
}
