import { MailTemplateRenderer } from './mail-template.renderer';

describe('MailTemplateRenderer', () => {
  let renderer: MailTemplateRenderer;

  beforeEach(() => {
    renderer = new MailTemplateRenderer();
  });

  describe('render', () => {
    it('should render the email-verification template with context', () => {
      const html = renderer.render('email-verification', {
        email: 'user@example.com',
        url: 'http://localhost:3002/api/v1/auth/verify/email?token=abc123',
      });

      expect(html).toContain('user@example.com');
      expect(html).toContain(
        'http://localhost:3002/api/v1/auth/verify/email?token=abc123',
      );
    });

    it('should inline <style> blocks into element style attributes', () => {
      const html = renderer.render('email-verification', {
        email: 'user@example.com',
        url: 'http://example.com/verify',
      });

      // css-inline moves rules from <style> to inline style attributes;
      // the raw <style> tag should no longer be present
      expect(html).not.toMatch(/<style[^>]*>/);
      expect(html).toMatch(/style="/);
    });

    it('should reuse the compiled template on subsequent renders', () => {
      const first = renderer.render('email-verification', {
        email: 'a@example.com',
        url: 'http://example.com/a',
      });
      const second = renderer.render('email-verification', {
        email: 'b@example.com',
        url: 'http://example.com/b',
      });

      expect(first).toContain('a@example.com');
      expect(second).toContain('b@example.com');
    });

    it('should throw when the template does not exist', () => {
      expect(() => renderer.render('does-not-exist', { foo: 'bar' })).toThrow();
    });
  });
});
