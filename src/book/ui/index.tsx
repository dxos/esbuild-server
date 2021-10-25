import React from 'react'
import { render } from 'react-dom'

import { extractStories } from './stories'
import { Storybook } from './Storybook'

export interface Spec {
  storyModules: Record<string, any>
  basePath: string
}

export function uiMain(spec: Spec) {
  render(<Storybook stories={extractStories(spec.storyModules, spec.basePath)} />,
    document.getElementById('root'));
}
