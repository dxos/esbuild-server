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
      {sorted.map(([file, mod]) => {
        return (
          <Story key={`${file}-${name}`} style={{ backgroundColor: file === selected.file ? 'lightsteelblue' : '' }}>
            <StoryTitle title={mod.title}>{mod.title}</StoryTitle>
            {Object.keys(mod.stories).map((name) => {
              return (
                <StoryItem key={name} style={{ backgroundColor: file === selected.file && name === selected.story ? 'darkseagreen' : ''  }}>
                  <NavLink to={`/${file}/${name}`}>{name}</NavLink>
                </StoryItem>
              )
            })}
          </Story>
        )
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 300px;
  overflow-x: auto;
  border-right: 1px solid #999;
  background-color: gainsboro;
`;

const Story = styled.div`
  margin-bottom: 12px;
  font-family: monospace;
  font-size: 15px;
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
  padding: 8px 0;
  padding-left: 8px;
  color: #111;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StoryItem = styled.div`
  padding: 8px 0;
  padding-left: 16px;
`;
