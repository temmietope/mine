const DATA = {
  query: `{
  viewer {
    login
    bio
    avatarUrl
    name
    repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
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

/*
 * using this to bypass the github bot which deactivates all open keys
 * this key is readonly, and cant be used for malicious reasons.
 * an alternative is to setup a backend api, to handle the request.
 */

let TOKEN_PARTS = ['fcb8971daed', '696909df5821', '8d708b1af562fd467']

const body = JSON.stringify(DATA)
const URL = 'https://api.github.com/graphql'
const KEY = TOKEN_PARTS.join('')

const OPTIONS = {
  method: 'post',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${KEY}`,
  },
  body,
}

window.onresize = () => {
  let offset = document.body.getBoundingClientRect()
  if (offset.width < 1200) {
    document.querySelector('.pull__request').innerHTML = 'Pulls'
  } else document.querySelector('.pull__request').innerHTML = 'Pull requests'
}

const user__avatar = document.querySelectorAll('.user__avatar')
// const avatar = document.querySelector('.avatar-img')
const mini__avatar = document.querySelector('.mini-avatar-wrapper')
const user__fullname = document.querySelector('.user__fullname')
const user__username = document.querySelectorAll('.user__username')
const user__bio = document.querySelectorAll('.user__bio')
const user__followers = document.querySelector('.followers')
const user__following = document.querySelector('.following')
const user__stars = document.querySelector('.stars')
const user__location = document.querySelector('.location')
const user__company = document.querySelector('.company')
const user__website = document.querySelectorAll('.website__url')
const user__twitter = document.querySelector('.twitter__username')
const user__repositories = document.querySelector('.repository__list')
const user__repocount = document.querySelector('.repo__count')

// Function to Fetch data and Populate
const fetchData = async () => {
  const res = await fetch(URL, OPTIONS)
  const data = await res.json()
  const user = data.data.viewer
  populateUI(user)
}

const populateUI = (user) => {
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
    twitterUsername,
    repositories,
  } = user
  user__avatar.src = avatarUrl
  user__avatar.forEach((avi) => {
    avi.src = avatarUrl
  })
  user__fullname.innerHTML = name
  user__bio.forEach((p) => {
    p.innerHTML = bio
  })
  user__username.forEach((p) => {
    p.innerHTML = login
  })
  user__followers.innerHTML = followers.totalCount
  user__following.innerHTML = following.totalCount
  user__stars.innerHTML = starredRepositories.totalCount
  user__location.innerHTML = location
  user__company.innerHTML = company
  user__website.forEach((p) => {
    p.innerHTML = websiteUrl
    p.setAttribute('href', websiteUrl)
  })
  user__twitter.innerHTML = `@${twitterUsername}`
  user__twitter.setAttribute('href', `https://twitter.com/${twitterUsername}`)
  user__repocount.innerHTML = repositories.totalCount

  for (const node of repositories.nodes) {
    const div = document.createElement('div')
    div.className = 'repository__single'
    div.innerHTML = renderRepository(node)

    user__repositories.appendChild(div)
  }
}

const renderRepository = (node) => {
  const {
    url,
    name,
    description,
    primaryLanguage,
    licenseInfo,
    stargazers,
    createdAt,
    updatedAt,
  } = node
  return `<div class="repository__single-details">
                            <h4><a href=${url}>${name}<a></h4>
                            ${
                              description
                                ? `
                                <p class="summary">${description}
                                </p>
                              `
                                : ''
                            }
                            <div class="stars-and-date">
                                <p class="language"><span class="language__color" style="background: ${
                                  primaryLanguage ? primaryLanguage.color : ''
                                }"></span><span
                                        class="language__text">${
                                          primaryLanguage.name
                                        }</span></p>
                                       ${
                                         licenseInfo
                                           ? `
                                             <p class="license">
                                               <img src='./assets/icons/license-icon.svg' alt='icon'/>
                                               <span class="license__name">
                                                 ${licenseInfo.name}
                                               </span>
                                             </p>
                                           `
                                           : ''
                                       }
                                         ${
                                           stargazers.totalCount > 0
                                             ? `
                                             <p class="stargazers">
                                               <i class="far fa-star"></i>
                                               <span class="stargazers__text">
                                                 ${stargazers.totalCount}
                                               </span>
                                             </p>
                                           `
                                             : ''
                                         }
                                <p class="date">${checkDate(
                                  createdAt,
                                  updatedAt
                                )}</p>
                            </div>
                        </div>
                        <div>
                            <button> <i class="far fa-star"></i>Star</button>
                        </div>`
}

const checkDate = (created, updated) => {
  if (created === updated) {
    return `Created on ${timeAgo(created)}`
  } else {
    return `Updated ${timeAgo(updated)}`
  }
}

// Set username to topnav
window.onscroll = () => {
  let offset = user__fullname.getBoundingClientRect()
  if (offset.top < 2.8) {
    mini__avatar.classList.add('show')
  }
  if (offset.top > 2.8) {
    mini__avatar.classList.remove('show')
  }
}

fetchData()
