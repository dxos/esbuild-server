import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Stories } from "./stories";

export interface SidebarProps {
  stories: Stories
}

export const Sidebar = ({ stories }: SidebarProps) => {
  const sorted = Object.entries(stories).sort(([,a], [,b]) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });

  return (
    <Container>
      {sorted.map(([file, mod]) => (
        <Story key={`${file}-${name}`} >
          <StoryTitle title={mod.title}>{mod.title}</StoryTitle>
          {Object.keys(mod.stories).map((name) => (
            <StoryItem key={name}>
              <NavLink to={`/${file}/${name}`}>{name}</NavLink>
            </StoryItem>
          ))}
        </Story>
      ))}
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
  background-color: #FAFAFA;
`

const StoryTitle = styled.div`
  margin-bottom: 4px;
  color: #111;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Story = styled.div`
  margin: 8px;
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
`

const StoryItem = styled.div`
  margin-left: 10px;
`
