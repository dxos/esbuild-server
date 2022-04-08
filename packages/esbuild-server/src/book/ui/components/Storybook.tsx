//
// Copyright 2022 DXOS.org
//

import React from 'react';
import { Navigate, Outlet, useLocation, useParams, useRoutes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { Page } from '../pages';
import { StoryMap } from '../stories';
import { Mode } from '../theme';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import { Source } from './Source';

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

export interface StorybookProps {
  pages: Page[]
  stories: StoryMap
  options?: {
    mode?: Mode
  }
}

const Layout = ({
  pages,
  stories,
  options = {}
}: StorybookProps) => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Sidebar
          pages={pages}
          stories={stories}
          mode={options.mode}
        />

        <StoryContainer>
          <Outlet />
        </StoryContainer>
      </Container>
    </>
  );
};

const Page = ({ pages }: { pages: Page[] }) => {
  const { page } = useParams();
  const { page: Page } = pages.find(({ title }) => title === page) ?? { page: () => null };

  return (
    <PageContainer>
      <Page />
    </PageContainer>
  );
};

const Story = ({ stories: storiesMap, mode }: { stories: StoryMap, mode?: Mode}) => {
  const { file, story: name } = useParams();
  const { search } = useLocation();
  const story = file && storiesMap[file];
  if (!story) {
    return null;
  }

  if (search) {
    return (
      <Source code={story.source} mode={mode} />
    );
  }

  return (
    <StoryFrame src={`#/__story/${file}/${name}`} />
  );
};

export const Storybook = ({
  pages,
  stories,
  options = {}
}: StorybookProps) => useRoutes([
  {
    path: '/__story',
    children: Object.entries(stories).map(([file, module]) => ({
      path: file,
      children: Object.entries(module.stories).map(([name, Story]) => ({
        path: name,
        element: <Story />
      }))
    }))
  },
  {
    path: '/',
    element: (
      <Layout
        pages={pages}
        stories={stories}
        options={options}
      />
    ),
    children: [
      {
        path: ':page',
        element: <Page pages={pages} />
      },
      {
        path: 'story/:file/:story',
        element: <Story stories={stories} mode={options.mode} />
      }
    ]
  },
  { path: '*', element: <Navigate to='/' /> }
]);
