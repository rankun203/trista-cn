import React from "react"
import _get from "lodash/get"
import styled from "styled-components"
import { Link } from "gatsby"

const LinkWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${props => props.projectTileColor || props.theme.color};
  grid-column: ${props =>
    props.project.projectTileIsWide ? "1/3" : "initial"};
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.06);
  text-decoration: none;
  overflow-y: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-25px);
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.12);

    .link-copy {
      opacity: 1;
    }

    video {
      /* transform: translateY(24px); */
    }
  }

  .link-copy {
    opacity: 0;
    transition: opacity 0.2s;

    @media (max-width: 780px) {
      opacity: 1;
    }
  }

  video {
    max-width: 100%;
    max-height: 80%;
    margin-top: auto;
    transition: transform 0.2s;
  }
`

const ProjectCoverImg = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-image: url(${props => props.src});
`

const LinkCopy = styled.div`
  margin-top: 70px;
  padding: 0 30px;
  color: ${props =>
    props.isInverseColor ? props.theme.colorInverse : props.theme.color};
  font-size: 24px;
  line-height: 180%;
  font-weight: 500;
  text-align: center;
`

export const ProjectCard = ({ ...props }) => {
  const project = props.project
  const noWindow = typeof window === `undefined`
  const videoRef = React.useRef()
  const [projectVideo, updateProjectVideo] = React.useState(
    _get(project, "projectVideo[0]")
  )
  const [projectTileColor, updateProjectTileColor] = React.useState(
    project.projectTileColor
  )

  const projectCover =
    _get(project, "projectCover[0].localImage.publicURL") ||
    _get(project, "heroPicture[0].localImage.publicURL")

  React.useEffect(() => {
    if (projectVideo && typeof window !== `undefined`) {
      if (window.innerWidth < 780) {
        // Mobile view
        const smallVideo = _get(project, "projectVideoSmall[0]")
        if (smallVideo) {
          updateProjectVideo(smallVideo)
          if (project.projectTileColorSmall) {
            updateProjectTileColor(project.projectTileColorSmall)
          }
        }
      }
    }
  }, [project, projectVideo, noWindow])

  /** Trying to fix muted not being set on ios video tag */
  if (videoRef.current && !videoRef.current.defaultMuted) {
    videoRef.current.defaultMuted = true
    videoRef.current.muted = true
  }

  // Have to disable ssr for this component for now
  if (noWindow) return null

  return (
    <LinkWrapper
      to={`/projects/${project.slug}`}
      projectTileColor={projectTileColor}
      {...props}
    >
      <LinkCopy
        className="link-copy"
        isInverseColor={project.projectTileIsInversedColor}
      >
        {project.projectTitleShort}
      </LinkCopy>
      {projectVideo ? (
        <video
          preload="metadata"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          ref={videoRef}
        >
          <source
            src={projectVideo.localVideo.publicURL}
            type={projectVideo.mimeType}
          />
        </video>
      ) : (
        (projectCover && <ProjectCoverImg src={projectCover.url} />) || null
      )}
    </LinkWrapper>
  )
}
