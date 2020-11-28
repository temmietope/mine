const DATA = {
  query: `{
  viewer {
    login
    bio
    avatarUrl
    name
    repositories(last: 20, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
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
  // user__repositories
  // repositories.nodes.
  for (const node of repositories.nodes) {
    const div = document.createElement('div')
    div.className = 'repository__single'
    div.innerHTML = `<div class="repository__single-details">
                            <h4>${node.name}</h4>
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
                                  node.primaryLanguage.color
                                }"></span><span
                                        class="language__text">${
                                          node.primaryLanguage.name
                                        }</span></p>
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
                                <p class="date">Updated 3 days ago</p>
                            </div>
                        </div>
                        <div>
                            <button> <i class="far fa-star"></i>Star</button>
                        </div>`

    user__repositories.appendChild(div)
    // const color = document.querySelector('.language__color')
    // color.style.backgroundColor = 'yellow'
  }
}

fetchData()
