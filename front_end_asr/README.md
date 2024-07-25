# Front End Setup for ASR Project

Quickly set up the front-end part of the ASR project by following these steps. This guide includes installing Node Version Manager (nvm), using a specific Node.js version, and starting the project.

## Setup Instructions

### Installing NVM and Node.js

1. **Install NVM (Node Version Manager):**

   - **Linux/macOS:**

     Open your terminal and run:

     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
     ```

     Or, if you prefer `wget`, use:

     ```bash
     wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
     ```

     Restart your terminal or run:

     ```bash
     export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
     ```

   - **Windows:**

     Download and run the `nvm-setup.zip` installer from [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases).

2. **Install and Use Node.js 16.20.2:**

   Once `nvm` is installed, close and reopen your terminal, then run:

   ```bash
   nvm install 16.20.2
   nvm use 16.20.2
  ```
https://www.youtube.com/watch?v=BhLFxy6Jz8c
