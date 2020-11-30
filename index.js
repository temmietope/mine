const DATA = {
  query: `{
  viewer {
    login
    bio
    avatarUrl
    name
    repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}, privacy: PUBLIC) {
      nodes {
        createdAt
        updatedAt
        description
        primaryLanguage {
          color
          name
        }
        stargazers {
          totalCount
        }
        url
        isFork
        forkCount
        licenseInfo {
          name
        }
        name
      }
      totalCount
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
    twitterUsername
    starredRepositories {
      totalCount
    }
    company
    location
    url
    websiteUrl
  }
}

`,
}

const body = JSON.stringify(DATA)
const URL = 'https://api.github.com/graphql'
const TOKEN = 'e5794bbde490a295da5410ee5bebd624665c3bee'

const OPTIONS = {
  method: 'post',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
  body,
}

const user__avatar = document.querySelectorAll('.user__avatar')
const user__fullname = document.querySelector('.user__fullname')
const user__username = document.querySelector('.user__username')
const user__bio = document.querySelector('.user__bio')
const user__followers = document.querySelector('.followers')
const user__following = document.querySelector('.following')
const user__stars = document.querySelector('.stars')
const user__location = document.querySelector('.location')
const user__company = document.querySelector('.company')
const user__website = document.querySelector('.website__url')
const user__repositories = document.querySelector('.repository__list')
const user__repocount = document.querySelector('.repo__count')

const fetchData = async () => {
  const res = await fetch(URL, OPTIONS)
  const data = await res.json()
  const user = data.data.viewer
  console.log(user)
  const {
    avatarUrl,
    login,
    name,
    bio,
    followers,
    following,
    starredRepositories,
    company,
    location,
    websiteUrl,
    repositories,
  } = user
  user__avatar.src = avatarUrl
  user__avatar.forEach((avi) => {
    avi.src = avatarUrl
  })
  user__fullname.innerHTML = name
  user__bio.innerHTML = bio
  user__username.innerHTML = login
  user__followers.innerHTML = followers.totalCount
  user__following.innerHTML = following.totalCount
  user__stars.innerHTML = starredRepositories.totalCount
  user__location.innerHTML = location
  user__company.innerHTML = company
  user__website.innerHTML = websiteUrl
  user__repocount.innerHTML = repositories.totalCount

  // user__repositories
  // repositories.nodes.
  for (const node of repositories.nodes) {
    const div = document.createElement('div')
    div.className = 'repository__single'
    div.innerHTML = `<div class="repository__single-details">
                            <h4><a href=${node.url}>${node.name}<a></h4>
                            ${
                              node.description
                                ? `
                                <p class="summary">${node.description}
                                </p>
                              `
                                : ''
                            }
                            <div class="stars-and-date">
                                <p class="language"><span class="language__color" style="background: ${
                                  node && node.primaryLanguage.color
                                }"></span><span
                                        class="language__text">${
                                          node.primaryLanguage.name
                                        }</span></p>
                                       ${
                                         node.licenseInfo
                                           ? `
                                             <p class="license">
                                               <img src='./assets/icons/license-icon.svg' alt='icon'/>
                                               <span class="license__name">
                                                 ${node.licenseInfo.name}
                                               </span>
                                             </p>
                                           `
                                           : ''
                                       }
                                         ${
                                           node.stargazers.totalCount > 0
                                             ? `
                                             <p class="stargazers">
                                               <i class="far fa-star"></i>
                                               <span class="stargazers__text">
                                                 ${node.stargazers.totalCount}
                                               </span>
                                             </p>
                                           `
                                             : ''
                                         }
                                <p class="date">${checkDate(
                                  node.createdAt,
                                  node.updatedAt
                                )}</p>
                            </div>
                        </div>
                        <div>
                            <button> <i class="far fa-star"></i>Star</button>
                        </div>`

    user__repositories.appendChild(div)
  }
}

const checkDate = (created, updated) => {
  console.log(created,updated)
  if (created === updated) {
    return `Created on ${timeAgo(created)}`
  } else {
    return `Updated ${timeAgo(updated)}`
  }
}

let timestamp = '2020-09-23T10:36:48Z'
function timeAgo(timestamp) {
  let date = new Date(timestamp)
  let dateMillis = date.getTime()
  let seconds = Math.floor((new Date() - dateMillis) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return `on ${date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })}`
  }
  interval = seconds / 86400
  if (interval > 1) {
    return `${Math.floor(interval)} ${
      Math.floor(interval) > 1 ? 'days' : 'day'
    } ago`
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}

console.log(timeAgo(timestamp))
fetchData()
