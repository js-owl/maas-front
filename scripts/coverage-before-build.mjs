import { spawnSync } from 'node:child_process'

// GitLab already runs `npm run test:coverage` in the test stage.
// Docker image builds set SKIP_COVERAGE so they do not repeat that suite.
if (process.env.CI === 'true' || process.env.SKIP_COVERAGE === '1') {
  console.log('Skipping test coverage before build.')
  process.exit(0)
}

const result = spawnSync('npm', ['run', 'test:coverage'], {
  stdio: 'inherit',
  shell: true,
})

process.exit(result.status ?? 1)
