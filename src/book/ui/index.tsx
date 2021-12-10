import React from 'react'
import { render } from 'react-dom'

import { extractStories } from './stories'
import { Storybook } from './Storybook'

// TODO(burdon): Move code out of index!

export interface Story {
  module: any // Contains exports of module.
  source: string
}

export interface Spec {
  storyModules: Record<string, Story>
  basePath: string
}

export function uiMain(spec: Spec) {
  render(<Storybook stories={extractStories(spec.storyModules, spec.basePath)} />,
  document.getElementById('root'));
}
