import { spawn } from 'node:child_process'
import Path from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const isSeedCommand = args.some((argument) => argument === 'seed:run' || argument.startsWith('seed:'))

if (process.env.NODE_ENV === 'production' && isSeedCommand) {
  console.log('Production database seeding is disabled; skipping seed command.')
  process.exit(0)
}

const directory = Path.dirname(fileURLToPath(import.meta.url))
const knexCli = Path.resolve(directory, '../../node_modules/knex/bin/cli.js')
const knexfile = Path.resolve(directory, 'knexfile.js')

const child = spawn(process.execPath, [knexCli, '--knexfile', knexfile, ...args], {
  stdio: 'inherit',
})

child.on('error', (error) => {
  console.error(`Unable to start Knex: ${error.message}`)
  process.exitCode = 1
})

child.on('exit', (code) => {
  process.exitCode = code ?? 1
})
