import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Stories } from "./stories";

export interface SidebarProps {
  stories: Stories
}

export const Sidebar = ({ stories }: SidebarProps) => (
  <Container>
    {Object.entries(stories).map(([file, mod]) => (
      <div>
        <div>{mod.title}</div>
        {Object.keys(mod.stories).map((name) => (
          <StoryItem>
            <NavLink to={`/${file}/${name}`}>{name}</NavLink>
          </StoryItem>
        ))}
      </div>
    ))}
  </Container>
)

const Container = styled.div`
  overflow-x: auto;
  border-right: 1px solid black;
`

const StoryItem = styled.div`
  margin-left: 10px;
`
