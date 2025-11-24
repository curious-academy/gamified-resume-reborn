import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Pipe to sanitize HTML content before rendering
 * This prevents XSS vulnerabilities when using innerHTML binding
 * Uses Angular's built-in HTML sanitization via SecurityContext.HTML
 *
 * @example
 * <div [innerHTML]="description | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}
