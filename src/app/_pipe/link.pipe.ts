import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'link'
})
export class LinkPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    return this.domSanitizer.bypassSecurityTrustHtml(this.stylize(value));
  }

  private stylize(text: string): string {
    let stylizedText = '';
    if (text && text.length > 0) {
      for (const t of text.split(' ')) {
        if (t.startsWith('http') && t.length > 1) {
          stylizedText += `<a target="_blank" rel="noopener noreferrer" class="highlight" href="${t}">${t}</a> `;
        } else {
          stylizedText += t + ' ';
        }
      }
      return stylizedText;
    } else {
      return text;
    }
  }
}
