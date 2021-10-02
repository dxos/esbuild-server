import React from 'react'
import { Link } from 'react-router-dom';
import { Stories } from "./stories";

export interface SidebarProps {
  stories: Stories
}

export const Sidebar = ({ stories }: SidebarProps) => (
  <div>
    {Object.entries(stories).map(([file, mod]) => (
      <div>
        <div>{mod.title}</div>
        {Object.keys(mod.stories).map((name) => (
          <div>
            <Link to={`/${file}/${name}`}>{name}</Link>
          </div>
        ))}
      </div>
    ))}
  </div>
)
