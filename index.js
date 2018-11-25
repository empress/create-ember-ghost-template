#!/usr/bin/env node

const execa = require('execa');
const whoRanMe = require('who-ran-me');
const minimist = require('minimist');

const parsedArgs = minimist(process.argv.slice(2));

const args = ['addon'];

// yarn reports the bin script from who-ran-me
if (['yarn', 'create-ember-ghost-template'].includes(whoRanMe())) {
  args.push('--yarn');
}

const templateName = parsedArgs._[0];
const pluginName = `ember-ghost-${templateName}-template`;

args.push(pluginName);

for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i] !== templateName) {
    args.push(process.argv[i]);
  }
}

(async () => {
  try {
    await execa('ember', args, { stdio: 'inherit' });
    await execa('ember', ['install', 'ember-ghost', 'ember-ghost-base-template'], { cwd: pluginName, stdio: 'inherit' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error running 'create-ember-ghost-template': ${err.message}`, err);
  }
})();
