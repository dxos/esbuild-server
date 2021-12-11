import React from 'react'
import { render } from 'react-dom'

import { extractStories } from './stories'
import { Storybook } from './components'

export interface Story {
  module: any // Contains exports of module.
  source: string
}

export interface Spec {
  basePath: string
  readme: string
  modules: Record<string, Story>
}

export function uiMain(spec: Spec, options: any) {
  render((
    <Storybook
      readme={spec.readme}
      stories={extractStories(spec.modules, spec.basePath)}
      options={options}
    />
  ),
  document.getElementById('root'));
}
