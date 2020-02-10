import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"
import {
  LazyLoadComponent,
  trackWindowScroll,
} from "react-lazy-load-image-component"
import { ProjectCard } from "./project-card"
// import { data } from "./projects-data"

const GalleryWrapper = styled.div`
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  grid-template-columns: repeat(2, minmax(375px, 1fr));
  grid-auto-rows: 500px;
  grid-gap: ${props => props.theme.gapSize * 5}px;

  @media all and (max-width: ${props => props.theme.mobileWidth}px) {
    grid-template-columns: 1fr;

    & > a {
      grid-column: 1/2 !important;
    }
  }
`

export const ProjectGallery = trackWindowScroll(
  ({ scrollPosition, projects = [], loadByDefault = false, className }) => {
    return (
      <GalleryWrapper className={className}>
        {projects.map(p => (
          <LazyLoadComponent
            threshold={800}
            scrollPosition={scrollPosition}
            key={uuid()}
            visibleByDefault={loadByDefault}
          >
            <ProjectCard project={p} />
          </LazyLoadComponent>
        ))}
      </GalleryWrapper>
    )
  }
)
