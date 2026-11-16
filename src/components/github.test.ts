// Runs on Node's built-in test runner (`npm test`), which strips the types itself: no test dependency needed.
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { githubUser, parseProfile } from './github.ts'

describe('githubUser', () => {
  it('reads the username from profile and repo links', () => {
    assert.equal(githubUser('https://github.com/0skrrr'), '0skrrr')
    assert.equal(githubUser('https://www.github.com/0skrrr/Portfolio2'), '0skrrr')
  })

  it('rejects other hosts, empty paths and invalid names', () => {
    assert.equal(githubUser('https://gitlab.com/0skrrr'), null)
    assert.equal(githubUser('https://github.com/'), null)
    assert.equal(githubUser('https://github.com/-bad-'), null)
    assert.equal(githubUser('not a url'), null)
  })
})

describe('parseProfile', () => {
  const user = { login: 'ada', name: 'Ada', avatar_url: 'https://avatars.example/ada', bio: null, public_repos: 3, followers: 7 }

  it('keeps only the fields the card shows', () => {
    const repos = [{ name: 'one', language: 'TypeScript', private: false }, { name: 'two', language: null }]
    assert.deepEqual(parseProfile(user, repos), {
      login: 'ada', name: 'Ada', avatar: 'https://avatars.example/ada', bio: null, repoCount: 3, followers: 7,
      repos: [{ name: 'one', language: 'TypeScript' }, { name: 'two', language: null }],
    })
  })

  it('rejects responses without a login or with a non-https avatar', () => {
    assert.equal(parseProfile({ message: 'API rate limit exceeded' }, null), null)
    assert.equal(parseProfile({ ...user, avatar_url: 'javascript:alert(1)' }, []), null)
    assert.equal(parseProfile(null, []), null)
  })

  it('drops malformed repos and tolerates a failed repo request', () => {
    assert.deepEqual(parseProfile(user, [{ name: 1 }, null, { name: 'ok' }])?.repos, [{ name: 'ok', language: null }])
    assert.deepEqual(parseProfile(user, null)?.repos, [])
  })
})
