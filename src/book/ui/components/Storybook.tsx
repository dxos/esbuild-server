import React from 'react'
import { HashRouter, Switch, Route, Redirect, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { Stories } from '../stories';
import { Sidebar } from './Sidebar';
import { Source } from './Source';

const mode = 'dark';

export interface StorybookProps {
  stories: Stories
}

const Main = ({ stories }: StorybookProps) => {
  const { file, story }: { file: string, story: string } = useParams();
  const { search } = useLocation();

  return (
    <Container>
      <Sidebar
        stories={stories}
        selected={{ file, story }}
        mode='dark'
      />

      <Switch>
        {Object.entries(stories).map(([file, { stories, source }]) =>
          Object.keys(stories).map((name) => (
            <Route exact path={`/${file}/${name}`}>
              <StoryContainer>
                {search ? (
                  <Source code={source} mode={mode} />
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

export const Storybook = ({ stories }: StorybookProps) => {
  console.log(stories);

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

        <Route path='/__source'>
          {Object.entries(stories).map(([file, { source }]) => (
            <Route key={`${file}`} exact path={`/__source/${file}`}>
              <pre>{source}</pre>
            </Route>
          ))}
        </Route>

        <Route path={['/:file/:story', '/']}>
          <Main stories={stories} />
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
