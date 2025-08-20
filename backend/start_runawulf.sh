#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd "/home/nikel/workspace/runawulf/backend"
npx ts-node src/index.ts
