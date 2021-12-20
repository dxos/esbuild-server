import React, { FunctionComponent } from 'react'
import { render } from 'react-dom'

import { extractStories } from './stories'
import { PageType, Storybook } from './components'

export interface Story {
  module: any // Contains exports of module.
  source: string
}

export interface Spec {
  basePath: string
  pages: PageType[]
  modules: Record<string, Story>
}

export function uiMain(spec: Spec, options: any) {
  const pages = spec.pages.map(([path, component]): PageType => {
    const name = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
    return [name, component];
  });

  render((
    <Storybook
      pages={pages}
      stories={extractStories(spec.modules, spec.basePath)}
      options={options}
    />
  ),
  document.getElementById('root'));
}
