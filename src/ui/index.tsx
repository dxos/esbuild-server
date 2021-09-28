import React, { FC } from 'react'
import { render } from 'react-dom'

interface StorybookProps {
  stories: Record<string, FC>
}

const Storybook = ({ stories }: StorybookProps) => (
  <div>
    {Object.entries(stories).map(([name, Story]) => (
      <div>
        <h1>{name}</h1>
        <div style={{ border: '1px solid black', padding: '20px' }}> 
          <Story/>
        </div>
      </div>
    ))}
  </div>
)

function extractStories(mod: any): Record<string, FC> {
  const res: Record<string, FC> = {}

  for(const key of Object.keys(mod)) {
    if(typeof mod[key] === 'function') {
      res[key] = mod[key]
    }
  }

  return res
}

export function uiMain(mod: any) {
  render(<Storybook stories={extractStories(mod)} />, document.getElementById('root'))
}
