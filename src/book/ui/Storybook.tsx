import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Stories } from "./stories";
import React from 'react'
import styled from "styled-components";
import { Sidebar } from "./Sidebar";

export interface StorybookProps {
  stories: Stories
}

export const Storybook = ({ stories }: StorybookProps) => (
  <BrowserRouter>
    <Switch>
      <Route path="/__story">
        {Object.entries(stories).map(([file, mod]) =>
          Object.entries(mod.stories).map(([name, Story]) => (
            <Route exact path={`/__story/${file}/${name}`}>
              <Story />
            </Route>
          ))
        )}
      </Route>
      <Route>
        <Main>
          <Sidebar stories={stories} />
          <Switch>
            {Object.entries(stories).map(([file, mod]) =>
              Object.keys(mod.stories).map((name) => (
                <Route exact path={`/${file}/${name}`}>
                  <StoryContainer src={`/__story/${file}/${name}`}/>
                </Route>
              ))
            )}

            <Redirect to="/" />
          </Switch>
        </Main>
      </Route>
    </Switch>
  </BrowserRouter>
)

const Main = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  width: 100vw;
  height: 100vh;
`

const StoryContainer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`
