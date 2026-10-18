import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringToSlug',
  pure: true
})
export class StringToSlugPipe implements PipeTransform {

  transform(value: string, separator?: string): string {
    if (value) {
      return  value.toString().trim().toLowerCase()
        .replace(/\s+/g, separator ? separator : '-')           // Replace spaces with -
        .replace(/[^\w\-\u0980-\u09FF]+/g, '')       // Remove all non-word chars except Bengali
        .replace(/\-\-+/g, separator ? separator : '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');
    } else {
      return '';
    }

  }

}
