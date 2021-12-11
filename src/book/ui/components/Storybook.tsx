import React, { FunctionComponent } from 'react'
import { HashRouter, Switch, Route, Redirect, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { Stories } from '../stories';
import { Mode } from '../theme';
import { Page } from './Page';
import { Sidebar } from './Sidebar';
import { Source } from './Source';

export interface StorybookProps {
  readme?: FunctionComponent
  stories: Stories
  options?: {
    mode?: Mode
  }
}

const Main = ({
  readme: Component,
  stories,
  options = {}
}: StorybookProps) => {
  const { file, story }: { file: string, story: string } = useParams();
  const { search } = useLocation();

  return (
    <Container>
      <Sidebar
        stories={stories}
        selected={{ file, story }}
        mode={options.mode}
      />

      <Switch>
        <Route exact path='/'>
          {Component && (
            <StoryContainer>
              <Page>
                <Component />
              </Page>
            </StoryContainer>
          )}
        </Route>

        {Object.entries(stories).map(([file, { stories, source }]) =>
          Object.keys(stories).map((name) => (
            <Route exact path={`/${file}/${name}`}>
              <StoryContainer>
                {search ? (
                  <Source code={source} mode={options.mode} />
                ) : (
                  <StoryFrame src={`#/__story/${file}/${name}`}/>
                )}
              </StoryContainer>
            </Route>
          ))
        )}
      </Switch>
    </Container>
  );
};

export const Storybook = ({
  readme,
  stories,
  options = {}
}: StorybookProps) => {
  return (
    <HashRouter>
      <GlobalStyle />

      <Switch>
        {/* Stories to be loaded into the iframe. */}
        <Route path='/__story'>
          {Object.entries(stories).map(([file, mod]) =>
            Object.entries(mod.stories).map(([name, Story]) => (
              <Route key={`${file}-${name}`} exact path={`/__story/${file}/${name}`}>
                <Story />
              </Route>
            ))
          )}
        </Route>

        {/* Main layout. */}
        <Route path={['/:file/:story', '/']}>
          <Main
            readme={readme}
            stories={stories}
            options={options}
          />
        </Route>

        <Redirect to='/' />
      </Switch>
    </HashRouter>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow: hidden;
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
