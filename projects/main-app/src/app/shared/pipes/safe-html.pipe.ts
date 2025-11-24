import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe to sanitize HTML content before rendering
 * This prevents XSS vulnerabilities when using innerHTML binding
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

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}
