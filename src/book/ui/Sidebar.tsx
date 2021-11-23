import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { Stories } from './stories';

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
}

export const Sidebar = ({ stories, selected }: SidebarProps) => {
  const hierarchy = useMemo(() => createHierarchy(stories), [stories]);

  return (
    <Container>
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
  );
}

const palette = {
  dark: {
    fg: {
      main: '#AAA',
      header: '#57ACDB',
      story: '#BBB',
      selected: '#DDD',
      bullet: 'orange',
      border: '#555'
    },
    bg: {
      main: '#31313D',
      panel: '#31313D',
      module: '#31313D',
      selected: '#2C2B38'
    }
  },

  light: {
    fg: {
      main: '#666',
      header: '#57ACDB',
      story: '#333',
      selected: '#EEE',
      bullet: '#377BB8',
      border: '#AAA'
    },
    bg: {
      main: '#FAFAFA',
      panel: '#FAFAFA',
      module: '#FAFAFA',
      selected: '#377BB8'
    }
  }
};

const color = palette.dark;

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 300px;
  background-color: ${color.bg.main};
  color: ${color.fg.main};
  font-family: Arial;
  font-size: 16px;
  font-weight: 100;
  
  li, a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const Module = styled.div`
  background-color: ${color.bg.panel};
  padding-bottom: 8px;
  border-bottom: 1px solid ${color.fg.border};
`;

const ModuleTitle = styled.div`
  padding: 8px;
  overflow: hidden;
  background-color: ${color.bg.module};
  font-variant: small-caps;
`;

const StoryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Story = styled.li``;

const StoryTitle = styled.div`
  padding: 10px 24px;
  color: ${color.fg.header};
  font-size: 14px;
  font-family: monospace;
`;

const StoryItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  
  li::before {
    content: "\\25AA"; 
    color: ${color.fg.story};
    margin-right: 8px;
  }
`;

const StoryItem = styled.li<{ selected?: boolean }>`
  margin: 2px 0;
  padding: 8px 21px;
  background-color: ${props => props.selected && color.bg.selected};
  border-left: 3px solid ${props => props.selected ? color.fg.bullet : color.bg.module};
  a {
    text-decoration: none;
    color: ${props => props.selected ? color.fg.selected : color.fg.story};
  }
`;
