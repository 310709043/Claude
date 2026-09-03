import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// ANGLE is several times faster than software GL for this film's blurred
// backdrop. The frame-level delayRender retry in src/fonts.ts covers the
// rare wedged renderer tab.
Config.setChromiumOpenGlRenderer('angle');
