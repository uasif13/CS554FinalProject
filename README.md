<h1>Vaccine Scheduler</h1>
<h2>Project Description</h2>
<p>For our CS 554 Final Project, our team will be developing a coronavirus vaccine scheduler. Our team saw the difficulty of scheduling a vaccine appointment as the group of people eligible for the vaccine grows. Our group hopes to allow our clients to be notified immediately if there is an open appointment in the vicinity. Clients can tell our web application which vaccine appointment centers that they could travel to. Once an appointment is available, our web application will notify the client through text/email.</p>
<p>Our clients will be able to create a profile that will allow them to save location information on the sites that they will be able to register. They will also be able to scan their insurance information and extract text from the image and input forms. We will have an administration account that will keep track of vaccine supplies, schedule appointments, as well as a status page of updated vaccine administration. </p>
<h2>Contributors</h2>
<ul>
    <li>Alex Johnson</li>
    <li>Chloe Quinto</li>
    <li>Asif Uddin</li>
    <li>John Dyer</li>
    <li>Ayesha Parveen</li>
</ul>


<h2>Set Up Docker</h2>
```bash
# 1. Install Docker @ https://docs.docker.com/get-docker/
# 2. Install Docker-Compose on system @ "https://docs.docker.com/compose/install/"

# 3. Run the following 
cd CS554finalProject 
docker-compose up --build

# 4. Navigate to localhost:3000 for the app 
# 5. Enjoy!
```
***IMPORTANT: .env and an example insurance card will be provided in submission***

*Note: Docker Desktop for Mac includes Compose along with other Docker apps, so Mac users do not need to install Compose seperately*



<h2>Permissions</h2>
<ul>
<h4>User Credentials</h4>
<li>Register for one on the app!

<h4>Admin Credentials </h4>
<li>Email: admin@stevens.edu
<li>Password: admin123
</ul>


<h2>Core Technologies </h2>
<ul>
<li>React
<li>TypeScript
<li>Firebase Auth
</ul>
<h2>Independent Technologies </h2>
<ul>
<li>Tesseract - OCR Engine
<li>Docker - Containers
<li>Plivo - Text Messaging
</ul>