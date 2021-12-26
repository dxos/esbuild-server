import { FunctionComponent } from 'react';

export interface Page {
  title?: string
  path: string
  page: FunctionComponent
}

export function extractPages(pages: Page[]): Page[] {
  return pages.map(({ path, page }) => {
    // Remove extension.
    const title = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
    return { title, path, page }
  });
}
