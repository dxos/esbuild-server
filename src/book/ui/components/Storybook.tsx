import React from 'react'
import { HashRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { Page } from '../pages';
import { StoryMap } from '../stories';
import { Mode } from '../theme';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import { Source } from './Source';

export interface StorybookProps {
  pages: Page[]
  stories: StoryMap
  options?: {
    mode?: Mode
  }
}

const Main = ({
  pages,
  stories,
  options = {}
}: StorybookProps) => {
  const { search } = useLocation();

  return (
    <Container>
      <Sidebar
        pages={pages}
        stories={stories}
        mode={options.mode}
      />

      <Switch>
        {pages.map(({ title, page: Page }) => (
          <Route key={title} exact path={`/${title}`}>
            <StoryContainer>
              <PageContainer>
                <Page />
              </PageContainer>
            </StoryContainer>
          </Route>
        ))}

        {Object.entries(stories).map(([file, { stories, source }]) =>
          Object.keys(stories).map((name) => (
            <Route exact path={`/story/${file}/${name}`}>
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
  pages,
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
        <Route path={['/story/:file/:story', '/:page', '/']}>
          <Main
            pages={pages}
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
  overflow: hidden;
`;

const StoryFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
