import { Injectable } from '@nestjs/common';
import { inline } from 'css-inline';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';

type MailContext = Record<string, unknown>;

/**
 * Compiles and renders mail templates from src/mail/templates.
 * Templates are compiled once and cached; rendered HTML gets its <style>
 * blocks inlined so email clients apply the styles.
 */
@Injectable()
export class MailTemplateRenderer {
  private readonly templates = new Map<
    string,
    HandlebarsTemplateDelegate<MailContext>
  >();

  render(templateName: string, context: MailContext): string {
    const template = this.getTemplate(templateName);
    return inline(template(context), {});
  }

  private getTemplate(
    templateName: string,
  ): HandlebarsTemplateDelegate<MailContext> {
    const cached = this.templates.get(templateName);
    if (cached) {
      return cached;
    }

    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );
    const source = fs.readFileSync(templatePath, 'utf-8');
    const compiled = handlebars.compile<MailContext>(source);
    this.templates.set(templateName, compiled);

    return compiled;
  }
}
