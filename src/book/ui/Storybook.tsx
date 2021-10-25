import React from 'react'
import { HashRouter, Switch, Route, Redirect, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { Stories } from './stories';
import { Sidebar } from './Sidebar';

export interface StorybookProps {
  stories: Stories
}

const Main = ({ stories }: StorybookProps) => {
  const { file, story }: { file: string, story: string } = useParams();

  return (
    <Container>
      <Sidebar stories={stories} selected={{ file, story }} />

      <Switch>
        {Object.entries(stories).map(([file, mod]) =>
          Object.keys(mod.stories).map((name) => (
            <Route exact path={`/${file}/${name}`}>
              <StoryContainer>
                <StoryFrame src={`#/__story/${file}/${name}`}/>
              </StoryContainer>
            </Route>
          ))
        )}
      </Switch>
    </Container>
  );
};

export const Storybook = ({ stories }: StorybookProps) => {
  return (
    <HashRouter>
      <GlobalStyle />

      <Switch>
        <Route path='/__story'>
          {Object.entries(stories).map(([file, mod]) =>
            Object.entries(mod.stories).map(([name, Story]) => (
              <Route key={`${file}-${name}`} exact path={`/__story/${file}/${name}`}>
                <Story />
              </Route>
            ))
          )}
        </Route>

        <Route path='/:file/:story'>
          <Main stories={stories} />
        </Route>

        <Route exact path='/'>
          <Main stories={stories} />
        </Route>
        <Redirect to='/' />
      </Switch>
    </HashRouter>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
  }
`;

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const StoryContainer = styled.div`
  display: flex;
  flex: 1;
`;

const StoryFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
