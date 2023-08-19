# Whisper Notes

<div align="center">
  <img src="public/logo.png" alt="WhisperNotes Logo" width="200" height="200">
</div>

Whisper Notes is a simple voice-to-text clipboard application. With a quick keyboard shortcut, you can begin transcribing audio and have the results automatically placed in your clipboard. Whisper Notes also stores your transcriptions within the app, allowing for easy access and organization of past notes.

## Features

- **Effortless Transcription**: Press Command-Shift-X (Mac) or Control-Shift-X (Windows/Linux) to start your transcription. Press the same keys to stop.
- **Automatic Clipboard Insertion**: Once your transcription is done, it's immediately ready in your clipboard.
- **Transcription History**: Past transcripts are also stored within the app for quick reference.
- **Expandable Transcripts**: Double-click on any transcript in your history to expand it for easier reading. Press Escape to collapse it back down.
- **Easy Deletion**: You can easily delete previous transcripts.

## Getting Started

Follow these simple steps to get Whisper Notes up and running:

1. Download the Whisper Notes DMG file from the repository (currently, only a Mac version is available).
2. Open the DMG file and install the application.
3. Open the application. On the bottom right, you'll see a settings button, click on it.
4. You will be prompted to input your OpenAI API key in the settings. After inputting the key, press Enter.
5. Now, you can start using the app. Press Command-Shift-X (Mac) or Control-Shift-X (Windows/Linux) to start your transcription, and press the same keys to end the transcription.

Note: As of now, Whisper Notes is only available for Mac. If you'd like to contribute to making Whisper Notes available on other operating systems, please feel free to submit a Pull Request!

## Building from Source

To build the application from source, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install all the necessary dependencies.
4. After the installation is complete, run `npm run build` to build the project.
5. Once the build is complete, run `npm run dist` to create the distributable.
6. Navigate to the `dist` folder.
7. Click on the application to launch it.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. In particular, if you're interested in creating builds for other operating systems, your contributions would be very welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)
