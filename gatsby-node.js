/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)
const _get = require("lodash/get")
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { encrypt } = require("./src/components/encrypted/utils/encrypt")

exports.createResolvers = async ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions

  await createResolvers({
    CMS_images_Asset: {
      localImage: {
        type: "File",
        async resolve(parent) {
          let url = parent.url
          if (url.startsWith("//")) url = `https:${url}`

          return createRemoteFileNode({
            url: encodeURI(url),
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          })
        },
      },
    },
    CMS_videos_Asset: {
      localVideo: {
        type: "File",
        async resolve(parent) {
          let url = parent.url
          if (url.startsWith("//")) url = `https:${url}`

          return createRemoteFileNode({
            url: encodeURI(url),
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          })
        },
      },
    },
  })
}

const createProjectPages = (createPage, template, data) => {
  const NEXT_ITEMS = 2

  data.projects.forEach((p, i) => {
    const relatedProjects = []

    for (let j = 0, iCur = i + 1; j < NEXT_ITEMS; j++, iCur++) {
      if (!data.projects[iCur]) {
        iCur = 0
      }
      const relatedP = data.projects[iCur]
      relatedP.projectTileIsWide = false // For related projects, please, do not go full width...
      relatedProjects.push(relatedP)
    }

    let encryptedProjectStr
    if (p.isProtected) {
      console.log("Encrypting project", `/projects/${p.slug}`)
      encryptedProjectStr = encrypt(p, p.password)
    }
    p.password = undefined // Clear the password!

    createPage({
      path: `projects/${p.slug}`,
      component: template,
      context: {
        isProtected: p.isProtected,
        encryptedProjectStr,
        project: p,
        relatedProjects,
      },
    })
  })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const projectTemplate = path.resolve(`src/templates/project-template.js`)
  const result = await graphql(`
    {
      cms {
        projects: entries(section: "project") {
          id
          title
          slug
          ... on CMS_project_project_Entry {
            isProtected
            password
            projectTitleShort
            projectTileColor
            projectTileColorSmall
            projectTileIsInversedColor
            projectTileIsWide
            projectDescription
            projectClient
            projectMyRole
            projectDuration
            projectContentBody {
              ... on CMS_projectContentBody_textSection_BlockType {
                id
                typeHandle
                body
              }
              ... on CMS_projectContentBody_image_BlockType {
                id
                typeHandle
                image {
                  id
                  url
                  mimeType
                  width
                  height
                  size
                }
              }
            }
            heroPicture {
              id
              url
              mimeType
              width
              height
              size
            }
            projectCover {
              id
              url
              mimeType
              width
              height
              size
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  createProjectPages(createPage, projectTemplate, {
    projects: _get(result, "data.cms.projects", []),
  })
}
