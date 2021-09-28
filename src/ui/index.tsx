import React, { FC } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'

interface StorybookProps {
  stories: Stories
}

const Storybook = ({ stories }: StorybookProps) => (
  <BrowserRouter>
    <Main>
      <Sidebar stories={stories}/>
      <Switch>
        {Object.entries(stories).map(([file, mod]) => 
          Object.entries(mod).map(([name, Story]) => (
            <Route exact path={`/${file}/${name}`}>
              <StoryContainer>
                <Story/>
              </StoryContainer>
            </Route>
          )
        ))}

        <Redirect to="/" />
      </Switch>
    </Main>
  </BrowserRouter>
)

const Main = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  width: 100vw;
  height: 100vh;
`

const StoryContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`

export interface SidebarProps {
  stories: Stories
}

export const Sidebar = ({stories}: SidebarProps) => (
  <div>
    {Object.entries(stories).map(([file, mod]) => (
      <div>
        <div>{file}</div>
        {Object.keys(mod).map((name) => (
          <div>
            <Link to={`/${file}/${name}`}>{name}</Link>
          </div>
        ))}
      </div>
    ))}
  </div>
)

type Stories = Record<string, Record<string, FC>>

function extractStories(modules: Record<string, any>, basePath: string): Stories {
  const res: Stories = {}

  for(const file of Object.keys(modules)) {
    const key = convertFileNameToPathSegment(file, basePath)
    res[key] = {}
    const mod = modules[file]

    for(const comp of Object.keys(mod)) {
      if(typeof mod[comp] === 'function') {
        res[key][comp] = mod[comp]
      }
    }
  }

  return res
}

function convertFileNameToPathSegment(filename: string, basePath: string) {
  if(filename.startsWith(basePath)) {
    filename = filename.slice(basePath.length)
  }

  if(filename.startsWith('/')) {
    filename = filename.slice(1)
  }

  return filename.trim().replace(/[-\.\/]/g, '-');
}

export interface Spec {
  storyModules: Record<string, any>
  basePath: string
}

export function uiMain(spec: Spec) {
  render(<Storybook stories={extractStories(spec.storyModules, spec.basePath)} />, document.getElementById('root'))
}
