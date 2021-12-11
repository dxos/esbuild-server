import React from 'react'
import { render } from 'react-dom'

import { extractStories } from './stories'
import { Storybook } from './components'

export interface Story {
  module: any // Contains exports of module.
  source: string
}

export interface Spec {
  storyModules: Record<string, Story>
  basePath: string
}

export function uiMain(spec: Spec, options: any) {
  render(<Storybook stories={extractStories(spec.storyModules, spec.basePath)} options={options} />,
  document.getElementById('root'));
}
