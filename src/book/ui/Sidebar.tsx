import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { Stories } from './stories';

export interface SidebarProps {
  stories: Stories
  selected: { file: string, story: string }
}

export const Sidebar = ({ stories, selected }: SidebarProps) => {
  // TODO(burdon): Memoize.

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
  const flat = Object.keys(grouped).map(key => ({ module: key, stories: grouped[key] })).sort();

  console.log(JSON.stringify(flat, undefined, 2));
  // <StoryTitle title={mod.title}>
  //   {mod.title}
  // </StoryTitle>
  // {Object.keys(mod.stories).map((name) => (
  //   <StoryItem key={name} selected={file === selected.file && name === selected.story}>
  //     &gt; <NavLink to={`/${file}/${name}`}>{name}</NavLink>
  //   </StoryItem>
  // ))}

  return (
    <Container>
      <Header>esbuild-server book</Header>
      <List>
        {flat.map(({ module, stories }) => (
          <Module key={module}>
            <ModuleTitle>
              {module}
            </ModuleTitle>
            {stories.map(({ file, name, stories }: { file: string, name: string, stories: any[] }) => (
              <Story key={name}>
                <StoryTitle>{name}</StoryTitle>
                {stories.map(({ name }) => (
                  <StoryItem key={name} selected={file === selected.file && name === selected.story}>
                    &gt; <NavLink to={`/${file}/${name}`}>{name}</NavLink>
                  </StoryItem>
                ))}
              </Story>
            ))}
          </Module>
        ))}
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

const Module = styled.div`
  border-bottom: 1px solid #DDD;
  font-family: monospace;
  font-size: 16;
`;

const ModuleTitle = styled.div`
  padding: 6 16;
  color: darkblue;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1 solid #999;
`;

const Story = styled.div`
`;

const StoryTitle = styled.div`
  padding: 6 24;
  color: darkblue;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1 solid #999;
`;

const StoryItem = styled.div<{ selected?: boolean }>`
  padding: 6 32;
  background-color: ${props => props.selected && '#EEE'};
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
