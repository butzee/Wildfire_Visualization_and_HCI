# Wildfire Visualization and HCI

## NodeJs Installation Guide

This guide provides step-by-step instructions to install Node.js version 18.16.0 on different operating systems. Follow the instructions below based on your operating system:

### Linux

1. Open the terminal.
2. Run the following command to download the Node.js binary package:
   ```
   curl -o node-v18.16.0-linux-x64.tar.xz https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-x64.tar.xz
   ```
3. Extract the downloaded package using the following command:
   ```
   tar -xf node-v18.16.0-linux-x64.tar.xz
   ```
4. Move the extracted Node.js folder to the desired location (e.g., /usr/local/nodejs) using the following command:
   ```
   sudo mv node-v18.16.0-linux-x64 /usr/local/nodejs
   ```
5. Open the `.bashrc` file in a text editor using the following command:
   ```
   nano ~/.bashrc
   ```
6. Add the following line at the end of the `.bashrc` file:
   ```
   export PATH="/usr/local/nodejs/bin:$PATH"
   ```
7. Save the `.bashrc` file and exit the text editor.
8. Update the current terminal session with the updated environment variables by running the following command:
   ```
   source ~/.bashrc
   ```

### Mac

1. Open the terminal.
2. Run the following command to install the Node Version Manager (NVM):
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
3. Close and reopen the terminal to start a new session.
4. Run the following command to install Node.js version 18.16.0 using NVM:
   ```
   nvm install 18.16.0
   ```
5. Run the following command to use Node.js version 18.16.0:
   ```
   nvm use 18.16.0
   ```

### Windows

To install Node.js version 18.16.0 on Windows, you can use the official Node.js installer. Here are the steps:

1. Visit the official Node.js website: [https://nodejs.org](https://nodejs.org)
2. On the Node.js website, click on the "Downloads" button.
3. Under the "LTS" column, click on the "Windows Installer" button to download the Node.js installer for Windows.
4. Once the installer is downloaded, double-click on the installer file to run it.
5. In the installer wizard, select the desired options and click "Next" to proceed.
   - You can leave the default settings as they are unless you have specific requirements.
   - Make sure to check the "Automatically install the necessary tools..." option.
6. Read and accept the license agreement, then click "Next".
7. Choose the destination folder where Node.js will be installed, and click "Next".
   - You can keep the default folder or choose a different one.
8. Select the components you want to install (Node.js and npm), and click "Next".
   - It's recommended to keep both options checked.
9. Choose the start menu folder for the Node.js shortcuts, and click "Next".
10. Select any additional tasks if needed (e.g., Add to PATH), and click "Next".
    - It's recommended to enable the "Automatically install the necessary tools..." option.
11. Click "Install" to begin the installation process.
12. Wait for the installation to complete.
13. Once the installation is finished, click "Finish

## Application Startup Options

This application can be started using various methods. Choose the option that suits your needs:

### Option 1: Using NPM
1. Open the command prompt or terminal.
2. Navigate to the application directory.
3. Run the command `npm run start` to start the application.

### Option 2: Compilation as a Standalone File
1. Open the command prompt or terminal.
2. Navigate to the application directory.
3. Choose the appropriate command based on your operating system:
   - For Windows: Run `npm run build-win`.
   - For Linux: Run `npm run build-lin`.
   - For macOS: Run `npm run build-mac`.
4. After the compilation process, you can either:
   - Run the application directly without installation.
   - Install the application using an installer.

### Option 3: Running the Application Directly
For each operating system, follow the respective steps:

#### Windows
1. Open the 'dist' folder in the application directory.
2. Inside the 'dist' folder, locate the 'win-unpacked' folder.
3. Open the 'win-unpacked' folder.
4. Run the 'vhci.exe' executable file to start the application.

#### Linux
1. Open the 'dist' folder in the application directory.
2. Inside the 'dist' folder, locate the 'linux-unpacked' folder.
3. Open the 'linux-unpacked' folder.
4. Run the 'vhci' executable file either from the command line or by double-clicking.
   - Alternatively, you can directly execute the application by running the 'vhci-1.0.0.AppImage' file located in the 'dist' folder.

#### macOS
1. Open the 'dist' folder in the application directory.
2. Inside the 'dist' folder, locate the 'mac' folder.
3. Open the 'mac' folder.
4. Run the 'mac-arm64' executable file to start the application directly.

> Note: The specific installer or application file names mentioned above may vary based on your CPU architecture and the application version.

Choose the startup option that best suits your requirements to begin using the application.


## Application Usage Guide

This guide provides instructions on how to use the application, including visualization techniques and third-party sources used in the development.

### Features and Filtering

The application offers the following features for filtering the data:

#### Filtering by Year, Cause, and Size
- Use the year selection to animate fires per day of a specific year or to animate the cumulative fires for each year (Option: "All Years").
- Select multiple causes or sizes at once, or choose all together for filtering.

![Filtering](/assets/screenshot_filtering.png)

### Animation

To animate the filtered data, follow these steps:

1. Click the "Fetch Data" button in the top right to load the data. The loading animation will indicate the progress.
2. After the data has been loaded, click the Play button next to the time slider to start the animation.
3. You can drag the time slider or click on a specific point to control the animation.

![Animation](/assets/screenshot_loading.png)

### Further Configuration

The application provides additional configuration options:

- Use the speed icon button, located left of the Play button, to set different animation speeds.
- The next button further left allows you to scale the wildfire size by different factors, which can be useful when dealing with numerous small-sized wildfires.
- The button in the top right corner can be used to scale the map back to its original size.
- Switch between three different card types for displaying wildfires by clicking the button with the layer icon in the top right corner, below the previous button.
- The button with the circles icon allows you to switch between clustering of wildfires (useful for dense areas) and scatter mode (useful for scattered wildfires).

![Configuration](assets/screenshot_config.png)

### Fire Information

To access fire-specific information:

- Right-click on a fire to display useful information, including fire type, exact size of the area burned, location, discovery date, and containment details.
- Note that in some cases, certain attributes like containment day may not be available due to missing data in the database.

![Fire Information](/assets/screenshot_fire_info.png)

## Third-Party Sources and Visualization Techniques

The application incorporates the following resources and techniques:

### Task

- This project was developed as part of the "Visualization and HCI" lecture, which required creating an interactive visualization application beyond static illustrations and simple graphs.
- The design, project idea, and user experience were developed using the Five Design-Sheet methodology, a requirement for passing the module.

### Techniques

- The JavaScript library Maptalks was used to visualize the map and facilitate the rendering of a large quantity of data.
- The application utilizes the DeckGL plugin for Maptalks, enabling the rendering of thousands of data points per second.
- Data prefetching ensures smooth illustration of 2.3 million wildfires on almost any computer.

### Problems

- The size of the dataset, spanning 2.3 million database rows, posed a significant challenge. The application needed to load and render over 80,000 data points in under half a second to provide an optimal user experience.
- Missing data for a substantial portion of the fires required imputation or removal during the development process.

Please refer to the application interface for further instructions on using specific features and visualizations.