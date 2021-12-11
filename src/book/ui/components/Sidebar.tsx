import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

// Icons: https://styled-icons.dev
import { TextSnippet } from '@styled-icons/material-outlined'

import { Stories } from '../stories';
import { Mode, theme } from '../theme';

/**
 * Sort and groups stories into hierarchy.
 */
const createHierarchy = (stories: Stories) => {
  // Sort stories.
  const sorted = Object.entries(stories).sort(([, { title: a }], [,{ title: b }]) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });

  // Group stories.
  const grouped = sorted.reduce((result: any, story) => {
    const [file, { title, stories }] = story;
    const [module] = title.split('/');
    let value = result[module];
    if (!value) {
      value = [];
      result[module] = value;
    }

    const name = title.substring(title.indexOf('/') + 1);
    value.push({ file, name, stories: Object.entries(stories).map(([name, f]) => ({ name, f })) });
    return result;
  }, {});

  // Convert to array.
  const flatten = Object.keys(grouped).map(key => ({ module: key, stories: grouped[key] })).sort();
  // console.log(JSON.stringify(flat, undefined, 2));
  return flatten;
};

export interface SidebarProps {
  stories: Stories
  selected: { file: string, story: string }
  mode?: Mode
}

export const Sidebar = ({ stories, selected, mode }: SidebarProps) => {
  const hierarchy = useMemo(() => createHierarchy(stories), [stories]);

  return (
    <ThemeProvider theme={mode === 'dark' ? theme.dark : theme.light }>
      <Container>
        <Header>
          <NavLink to='/'>Home</NavLink>
        </Header>
        <ModuleList>
          {hierarchy.map(({ module, stories }) => (
            <Module key={module}>
              <ModuleTitle>
                {module}
              </ModuleTitle>
              <StoryList>
                {stories.map(({ file, name, stories }: { file: string, name: string, stories: any[] }) => (
                  <Story key={name}>
                    <StoryTitle>{name}</StoryTitle>
                    <StoryItemList>
                      {stories.map(({ name }) => (
                        <StoryItem key={name} selected={file === selected.file && name === selected.story}>
                          <NavLink to={`/${file}/${name}`}>{name}</NavLink>
                          <NavLink to={`/${file}/${name}?source`}>
                            <TextSnippet size={24} title='Source' />
                          </NavLink>
                        </StoryItem>
                      ))}
                    </StoryItemList>
                  </Story>
                ))}
              </StoryList>
            </Module>
          ))}
        </ModuleList>
      </Container>
    </ThemeProvider>
  );
};

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 300px;
  background-color: ${({ theme }) => theme.bg.main};
  color: ${({ theme }) => theme.fg.main};
  font-family: Arial;
  font-size: 16px;
  font-weight: 100;
  
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    white-space: nowrap;
  }
`;

const Header = styled.div`
  padding: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg.module};
  font-size: 18px;
  a {
    font-size: 16px;
    color: ${({ theme }) => theme.fg.story};
  }
`;

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const Module = styled.div`
  background-color: ${({ theme }) => theme.bg.panel};
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.fg.border};
`;

const ModuleTitle = styled.div`
  padding: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg.module};
  font-variant: small-caps;
  font-size: 18px;
`;

const StoryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Story = styled.li``;

const StoryTitle = styled.div`
  padding: 10px 24px;
  color: ${({ theme }) => theme.fg.header};
  font-size: 16px;
`;

const StoryItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  
  li::before {
    content: "\\25AA"; 
    color: ${({ theme }) => theme.fg.story};
    margin-right: 8px;
  }
`;

const StoryItem = styled.li<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  margin: 2px 0;
  padding: 6px 21px;
  background-color: ${({ theme, selected }) => selected && theme.bg.selected};
  border-left: 4px solid ${({ theme, selected }) => selected ? theme.fg.bullet : 'transparent'};
  a {
    display: flex;
    font-size: 16px;
    color: ${({ theme, selected }) => selected ? theme.fg.selected : theme.fg.story};
  }
  a:nth-child(1) {
    flex: 1;
  }
  a:nth-child(2) {
    flex-shrink: 0;
  }
`;
