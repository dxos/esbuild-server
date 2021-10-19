import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Stories } from "./stories";
import React from 'react'
import styled, { createGlobalStyle } from "styled-components";
import { Sidebar } from "./Sidebar";

export interface StorybookProps {
  stories: Stories
}

export const Storybook = ({ stories }: StorybookProps) => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route path="/__story">
          {Object.entries(stories).map(([file, mod]) =>
            Object.entries(mod.stories).map(([name, Story]) => (
              <Route key={`${file}-${name}`} exact path={`/__story/${file}/${name}`}>
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
                    <StoryContainer>
                      <StoryFrame src={`/__story/${file}/${name}`}/>
                    </StoryContainer>
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
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
  }
`

const Main = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

const StoryContainer = styled.div`
  display: flex;
  flex: 1;
`

const StoryFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`
