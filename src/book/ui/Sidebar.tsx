import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { Stories } from './stories';

export interface SidebarProps {
  stories: Stories
  selected: { file: string, story: string }
}

export const Sidebar = ({ stories, selected }: SidebarProps) => {
  const sorted = Object.entries(stories).sort(([, { title: a }], [,{ title: b }]) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });

  return (
    <Container>
      <Header>esbuild-server book</Header>
      <List>
        {sorted.map(([file, mod]) => {
          return (
            <Story key={`${file}-${name}`} selected={file === selected.file}>
              <StoryTitle title={mod.title}>
                {mod.title}
              </StoryTitle>
              {Object.keys(mod.stories).map((name) => {
                return (
                  <StoryItem key={name} selected={file === selected.file && name === selected.story}>
                    > <NavLink to={`/${file}/${name}`}>{name}</NavLink>
                  </StoryItem>
                )
              })}
            </Story>
          )
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 300;
  border-right: 1 solid #999;
`;

const Header = styled.div`
  display: flex;
  padding: 8 16;
  align-items: center;
  background-color: #DDD;
  font-family: sans-serif;
  font-size: 20;
  border-bottom: 1 solid #999;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: auto;
  background-color: #FAFAFA;
`;

const Story = styled.div<{ selected: boolean }>`
  margin-bottom: 16;
  font-family: monospace;
  font-size: 16;
  a {
    text-decoration: none;
    color: #555 !important;
  }
  a:hover {
    text-decoration: underline;
  }
  a:visited {
    color: #555 !important;
  }
`;

const StoryTitle = styled.div`
  padding: 16;
  color: darkblue;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1 solid #999;
`;

const StoryItem = styled.div<{ selected: boolean }>`
  background-color: ${props => props.selected && '#EEE'};
  padding: 8 16;
`;
