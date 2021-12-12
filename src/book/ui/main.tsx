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
  readme: FunctionComponent
  pages: PageType[]
  modules: Record<string, Story>
}

export function uiMain(spec: Spec, options: any) {
  const pages = spec.pages.map(([page, component]): PageType => {
    const name = page.substring(page.lastIndexOf('/') + 1).split('.')[0];
    return [name, component];
  });

  render((
    <Storybook
      readme={spec.readme}
      pages={pages}
      stories={extractStories(spec.modules, spec.basePath)}
      options={options}
    />
  ),
  document.getElementById('root'));
}
