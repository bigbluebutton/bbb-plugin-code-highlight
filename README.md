# Code Highlighter Plugin

## What is it?

The Code Highlighter Plugin serves as a chat tool for students and users to demonstrate and visualize code blocks in simpler and more visual ways.

In the following examples, we'll be using the code below:

````md
```java
public static void main() {
    int myInt = 123;
}

```
````


See how it looks for light theme:

![plugin demo screenshot in light theme](./public/assets/plugin_demo_light.png)

And for the dark theme:

![plugin demo screenshot in dark theme](./public/assets/plugin_demo_dark.png)

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/bbb-plugin-code-highlight
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `BbbPluginCodeHighlight.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in the `.properties` file from `bbb-web` in `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties`


## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`
