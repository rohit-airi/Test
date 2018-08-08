import { DefaultUrlSerializer, UrlTree } from '@angular/router';
export class CustomUrlSerializer extends DefaultUrlSerializer {
    parse(url: string): UrlTree {
      const testurl=super.parse(url);
        return super.parse(url);
    }
}
