import React, { FC } from 'react'
import { render } from 'react-dom'

interface StorybookProps {
  stories: Stories
}

const Storybook = ({ stories }: StorybookProps) => (
  <div>
    {Object.entries(stories).map(([file, mod]) => (
      <div>
        <div>{file}</div>
        {Object.entries(mod).map(([name, Story]) => (
          <div>
          <h1>{name}</h1>
          <div style={{ border: '1px solid black', padding: '20px' }}> 
            <Story/>
          </div>
        </div>
        ))}
      </div>
    ))}
  </div>
)

type Stories = Record<string, Record<string, FC>>

function extractStories(modules: Record<string, any>): Stories {
  const res: Stories = {}

  for(const file of Object.keys(modules)) {
    res[file] = {}
    const mod = modules[file]

    for(const key of Object.keys(mod)) {
      if(typeof mod[key] === 'function') {
        res[file][key] = mod[key]
      }
    }
  }
  

  return res
}

export function uiMain(modules: Record<string, any>) {
  render(<Storybook stories={extractStories(modules)} />, document.getElementById('root'))
}
