InfinityMath
InfinityMath is an interactive, educational web application designed to help users improve their mental math skills. The app generates arithmetic problems (addition, subtraction, and optionally multiplication/division), tracks performance with dynamic difficulty adjustments, provides interactive explanations, and displays detailed analytics via customizable charts. With Progressive Web App (PWA) support, InfinityMath can be installed on mobile devices and used offline, making it accessible anytime, anywhere.

Table of Contents
Overview
Features
Installation
Usage
Project Structure
Customization
Progressive Web App (PWA) Support
Known Issues and Future Improvements
Credits
License
Overview
InfinityMath is created with a focus on interactivity and effective learning. As users solve math problems, the app adjusts the difficulty level based on performance. Each question is timed, and interactive explanations help users understand the solution step-by-step. Performance data is collected and presented in various charts, allowing users to track their progress over time. With features like history tracking, session reports, and record deletion, InfinityMath offers a complete solution for users looking to improve their arithmetic speed and accuracy.

Features
InfinityMath is built with an extensive set of features:

Dynamic Difficulty: The app automatically adjusts the difficulty level (easy, medium, or hard) based on the user's recent performance.
Interactive Explanations: Detailed step-by-step explanations are provided for each question. In the main gameplay, these are interactive to help users learn the process; however, in the history view, the explanations are expanded for easy reading.
Time Tracking: Each question is timed with a visual progress bar indicating the remaining time. Users are encouraged to answer quickly while maintaining accuracy.
Comprehensive Analytics: The app features several charts:
A line graph tracking the response time for each question in the current session.
A performance chart showing average response time and accuracy across multiple sessions.
A session report overview that breaks down the total questions, correct and wrong answers.
History and Session Reports: Detailed history records are stored and can be viewed in a dedicated modal. Users can download individual session records as TXT files.
Record Management: A custom “Delete All Records” feature enables users to clear all session history, analytics, and warnings via a custom verification modal.
PWA and Offline Support: With a manifest file and a service worker, InfinityMath can be installed as a Progressive Web App (PWA) and works offline.
Responsive Design: The app’s layout is responsive and optimized for both desktop and mobile devices.
Custom Notifications: Success and error messages are displayed using custom-styled notifications, providing a seamless user experience without relying on browser alerts.
Installation
To install and run InfinityMath locally, follow these steps:

Clone the Repository:

bash
Copy
Edit
git clone https://github.com/yourusername/infinitymath.git
cd infinitymath
Set Up a Local Server:

Since service workers and PWA features require a secure context, it’s recommended to run the app on a local server. You can use a simple HTTP server, such as:

Using Python (for Python 3.x):

bash
Copy
Edit
python -m http.server 8000
Or using Node.js with the http-server package:

bash
Copy
Edit
npm install -g http-server
http-server -p 8000
Open the App:

Open your browser and navigate to http://localhost:8000/index.html.

Usage
Once you have the app running:

Start the Game:
Click the Start button on the landing screen. This will hide the start screen and load the main game view.

Answer Questions:
A math problem is displayed, and a timer begins. Enter your answer in the input field and click Submit. The app will provide immediate feedback with custom notifications and display an interactive explanation.

Proceed to Next Question:
Once feedback is shown, click the NEXT button to load a new question.

View Scorecard and History:
Access your overall performance by clicking the SCORECARD or HISTORY buttons in the header. You will be prompted for a password (default is 123454). The scorecard displays detailed charts and analytics, while the history modal shows individual session records.

Delete Records:
In the scorecard modal, click the Delete All Records button. A custom verification modal will appear. Confirm the deletion to clear all stored data, including session reports and history.

Offline Installation:
With the manifest and service worker in place, you can install InfinityMath on your device. Follow your browser’s instructions to add the app to your home screen.

Project Structure
Below is an overview of the main files and their purposes:

index.html:
Contains the HTML structure of the app, including modals for scorecard, history, password verification, and record deletion. Also includes links to the manifest and Chart.js.

styles.css:
Contains all styling rules for the app. This file covers general layout, responsive design, custom scrollbars, modal styling, custom notifications, and more.

app.js:
Contains all the JavaScript logic for the app. This includes question generation, timer functions, dynamic difficulty adjustments, interactive explanations, chart updates (using Chart.js), data management (history, session reports), custom notifications, and event handlers for modals.

sw.js:
The service worker file, responsible for caching essential assets and providing offline functionality.

manifest.json:
Contains the metadata required for PWA support (app name, icons, theme color, etc.).

Customization
InfinityMath is designed to be easily customizable. Some examples include:

Question Types:
Modify the question generation logic in app.js to add additional operations (e.g., fractions, decimals) or adjust the maximum numbers based on difficulty levels.

Styling:
Update styles.css to change the color scheme, typography, or layout. The CSS is fully modular, making it straightforward to create a unique look for your app.

Password and Data Management:
The default password for accessing the scorecard and history modals is set to 123454 in app.js. You can change this value as needed. Additionally, the data clearing function (triggered by the delete records button) can be adjusted if you want to selectively clear certain data.

Charts and Analytics:
Chart.js is used to display performance data. You can customize chart types, colors, and datasets by modifying the corresponding functions in app.js.

Progressive Web App (PWA) Support
InfinityMath includes a manifest.json file that defines the app's metadata, allowing it to be installed as a PWA. The key properties in the manifest include:

name/short_name:
The name of your app.
start_url:
The URL that loads when the app is launched.
display:
Set to standalone to allow the app to run like a native application.
background_color & theme_color:
Define the color scheme used on the splash screen and in the browser UI.
icons:
Specify various icon sizes for different devices.
The included service worker (sw.js) handles caching so that the app works offline. When served over HTTPS (or on localhost), users can install InfinityMath on their devices, complete with a standalone look and feel.

Known Issues and Future Improvements
While InfinityMath is fully functional, here are a few areas for future enhancements:

Expanded Problem Types:
Adding more diverse question types (e.g., algebra, word problems) could further enhance the learning experience.
User Accounts:
Implementing user authentication would allow personalized progress tracking across multiple sessions.
More Detailed Analytics:
Future versions could incorporate additional metrics, such as average time per operation type or performance trends over weeks/months.
Accessibility Enhancements:
Improving ARIA attributes and keyboard navigation would ensure the app is fully accessible.
Improved Offline Caching:
Refining the service worker logic to better handle updates and cache invalidation can improve the offline experience.
Credits
InfinityMath was developed to offer a fun and educational way to practice math skills. The project uses Chart.js for charting and leverages modern web technologies (HTML5, CSS3, JavaScript, and Service Workers) to provide a seamless PWA experience.

License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed. For more details, refer to the LICENSE file included in the repository.

InfinityMath is a versatile tool for improving mental math and tracking progress over time. Its combination of dynamic difficulty, interactive explanations, comprehensive analytics, and PWA features make it an ideal educational app for learners of all ages. Whether you are a student aiming to sharpen your arithmetic skills or a teacher looking for an engaging classroom tool, InfinityMath offers a complete, modern solution to math practice.

Enjoy exploring the app, and feel free to contribute suggestions or enhancements!
