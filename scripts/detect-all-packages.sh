SCRIPTS_PATH=./src/scripts

babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-composer-packages.js
babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-gem-packages.js
babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-go-packages.js
babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-npm-packages.js
babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-nuget-packages.js
babel-node --config-file ./babel.server.json $SCRIPTS_PATH/detect-pypi-packages.js
