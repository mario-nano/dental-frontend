<div align="center">
  ![Dentsemo](https://cdn.discordapp.com/attachments/1017822557514248263/1061618183838117908/logo_sm_trans.png){:height="200" width="200"}
  <br>
</div>

# Dentsemo
 


Dentisimo is a web platform that helps patients find and book dental appointments at local clinics. It features a calendar with available times and a map to search for clinics by location.

- [Introduction](#introduction)
- [Features](#features)
- [Architectural](#architectural)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
- [How to use](#how-to-use)
- [Dependencies](#dependencies)
  - [FrontEnd](#frontend)
  - [BackEnd](#backend)
- [Development team](#development-team)
- [Credits](#credits)
- [License](#license)



## Introduction
<div align="center">
<img src="https://cdn.discordapp.com/attachments/748531145351888900/1061794314243551272/Screenshot_2023-01-08_231133-removebg-preview.png" width="600" height="369"></div>
Dentisimo is a web platform that simplifies the process of finding and booking dental appointments for patients. It provides a calendar of available appointment times and a map to locate nearby clinics. Patients can use the calendar to choose a suitable time, book their appointment online, and make changes as needed. The aim of Dentisimo is to enhance the patient experience by offering a convenient way to schedule appointments and reduce waiting times for dental care.


## Features

The system shall provide a client front-end:

- Contain a map-view over Gothenburg that can be navigated and allow selecting dental office. 
- Visualize available and unavailable time slots for appointments which are divided into 30-minute slots. 
- After Doctor registration, Fika time slots will be chosen by the Doctor to be added to the calender
- After Doctor registration, Lunch time slot will be chosen by the Doctor to be added to the calender
- Delegate incoming user requests.
- React to responses with appropriate messaging or notifications to the user.
- React to simultaneous bookings by making changes in availability visible to
the user (preferably without requiring an active refreshing of the interface by
the user). 

The system shall provide back-end services
- System shall have API Gateway as a single point of entry for frontend client to
make requests
- API Gateway registers and unregisters all instances of deployed backend
microservices and distribute requests in ROUND_ROBIN method
- Authentication service will provide user registration and details, role definition
and login functions.
- Dental service will provide dental offices information.
- Appointment service will provide all appointment related transactions.
- Notification service will contain and deliver systemwide notifications to the
Frontend client.
- RabbitMQ service serving as AMQP broker will enable service-to-service
communications.
- Each type services will connect to single database as distributed database is
not in the requirements at this stage of development. 

## Architectural </br></br>
<div align="center"><img src="https://cdn.discordapp.com/attachments/748531145351888900/1061793879248076870/Screenshot_2023-01-08_232940.png"></div>

### Front-End
<b>Frontend client</b> app is developed on React library, which allows modular architecture
through components, rich library of plugins supported through NPM, reactive state
management, code reusability, and easy implementation with minimum learning curve.
Frontend web app will communicate with all microservice through API Gateway as well as
receiving notifications from AMQP RabbitMQ server through WebSockets. 


The system users have 4 distinct roles within the entire system.
1. Patient user:
   - Patients register into the system and provide their additional contact details as
part of the registration process.
   - Only Patient role users can request and make dental appointments for more
simpler role separation.
   - Patients make appointment or cancel their appointment from their profile
page.
2. Dental office (operator) user:
   - Dental office owners are defined as such that only “Dental office” role users
can create one dental office in the system.
   - Once operator user setup their dental office, the dental office is visible on the “Search clinic” map and can be selected by patients to make appointments.
   - Operator users can create only one dental office.
   - Operator users can view all appointment for their dental office and can cancel their appointment from their Dental office profile page.
3. Doctor user:
   - Dentists must register as Doctor users in the system.
   - Upon their first sign-in into the system, doctors must choose 1 dental office
which they choose as practicing doctor.
   - Once doctor chooses their dental office, then doctor is listed under the dental office and can be chosen by patients for appointments.
   - Doctor can view all appointments from their profile page, however they
cannot cancel any appointment.</br></br></br></br>

### Back-End

<b>The backend </b> services will be divided into a set of small, independent microservices that
communicate with each other using a pub/sub messaging system. This architecture, known as
microservices, allows for the website to be more modular and flexible, as each service can be
developed, tested, and deployed independently of the others. It also allows for greater
scalability, as services can be added or removed as needed to meet the changing needs of the
website.

The pub/sub messaging system will use RabbitMQ as the message broker through AMQP 0-
9-1 protocol. RabbitMQ will handle routing messages between the different services.
Services will publish messages to RabbitMQ, which will then route the messages to any
subscribed services. This asynchronous communication allows the services to operate
independently and scale more easily, as they are not dependent on each other for
communication.

An API Gateway will be used to expose the services to external clients, such as web and
mobile applications. The API Gateway will handle tasks such as microservices registry, load
balancing, and request routing. It will act as a single point of entry for external clients,
allowing them to access the various services offered by the website through a unified REST
API. This will improve the security and performance of the website, as the API Gateway can
handle tasks such as authentication and rate limiting that would otherwise need to be
implemented separately by each service.

A load balancer will be used to distribute incoming traffic to the different instances of each
type of the services. This will help to ensure that the website can handle high levels of traffic
and remain available even if individual services fail. The load balancer will automatically
route traffic to healthy services and redirect traffic away from any services that are
experiencing issues.

An authentication service will be used to handle user registration and login for the website.
This service will manage user accounts and provide access tokens that other services can use
to verify the identity of authenticated users. This will help to improve the security of the
website and protect sensitive user information, as the authentication service will handle tasks
such as secure storage of user credentials.

The website will make use of both PostgreSQL and MongoDB for data storage. PostgreSQL
is a powerful, open-source object-relational database system that is well-suited for handling
structured data. MongoDB is a NoSQL database that is designed for storing and querying
large volumes of unstructured data. The team will use PostgreSQL for storing structured data
such as user information, and we will use MongoDB for storing unstructured data such as
appointments, dental offices and notifications.

Each one of the services will be packaged in a Docker container. Docker is a tool that enables
the creation and management of containerized applications. Packaging the services in Docker
containers will allow the team to easily deploy and manage the services in different
environments, such as development, staging, and production. The Docker container images
will be pushed to the Azure Container Registry, which is a secure and scalable registry for
storing and managing Docker container images.

The services will be deployed to Azure App Services for hosting as well as Virtual Private
Server (VPS). Azure is a cloud computing platform that provides a range of services for
building, deploying, and managing applications. Azure App Services is a fully managed
platform for building, deploying, and scaling web, mobile, and API applications. It will
provide the necessary infrastructure and resources to run the services, including storage,
networking, and security.

When an instance of a microservice is started, it will be register itself on the API Gateway
using its current environmental variables defined for that service instance. This will allow the
service to be accessed through the API Gateway, and it will enable the API Gateway to route
requests to the appropriate service based on the requested endpoints. If a service is stopped, it
will be automatically unregistered from the API Gateway after two minutes of stopping using
stop script issuing CURL command to the API Gateway. This will help to ensure that the API
Gateway is only routing traffic to healthy and online services.

In summary, this hybrid approach will combine the benefits of a microservices architecture
with the added flexibility of a pub/sub messaging system using RabbitMQ. It will also make
use of an API Gateway, a load balancer, and an authentication service to provide additional
functionality and improve the security and performance of the website. Using Docker
containers will enable the team to easily manage and deploy the different services in a
consistent manner. Deploying the website to Azure will provide a reliable and secure hosting
environment, with the necessary infrastructure and resources to support the website. 

## How to use

To build, run or test the source package for the frontend app, you need to install NodeJS package manager first. 
Please refer to [GET NPM](https://www.npmjs.com/get-npm) page to download and install npm. <br /><br />
To run this project, launch Command prompt or terminal and navigate to frontend folder. And run:

    $ npm install

To run the website to use it, run:

    $ npm start




## Dependencies

### Frontend

- [@chakra-ui/core](https://chakra-ui.com/)
- [@fortawesome](https://fontawesome.com/)
- [@fullcalendar](https://fullcalendar.io/)
- [@mapbox](https://www.mapbox.com/)
- [@reduxjs/toolkit](https://redux-toolkit.js.org/)
- [@testing-library](https://testing-library.com/)
- [@types/react](https://www.npmjs.com/package/@types/react)
- [@types/react-redux](https://www.npmjs.com/package/@types/react-redux)
- [axios](https://github.com/axios/axios)
- [bootstrap](https://getbootstrap.com/)
- [bootstrap-icons](https://icons.getbootstrap.com/)
- [clsx](https://www.npmjs.com/package/clsx)
- [formik](https://formik.org/)
- [leaflet](https://leafletjs.com/)
- [react](https://reactjs.org/)
- [react-bootstrap](https://react-bootstrap.github.io/)
- [react-dom](https://reactjs.org/docs/react-dom.html)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-leaflet](https://react-leaflet.js.org/)
- [react-leaflet-markercluster](https://www.npmjs.com/package/react-leaflet-markercluster)
- [react-map-gl](https://uber.github.io/react-map-gl/)
- [react-password-strength-bar](https://www.npmjs.com/package/react-password-strength-bar)
- [react-redux](https://react-redux.js.org/)
- [react-router-dom](https://reactrouter.com/web/guides/quick-start)
- [react-scripts](https://www.npmjs.com/package/react-scripts)
- [react-toastify](https://fkhadra.github.io/react-toastify/)
- [reactstrap](https://reactstrap.github.io/)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [save](https://www.npmjs.com/package/save)
- [styled-components](https://styled-components.com/)
- [sweetalert2](https://sweetalert2.github.io/)
- [swr](https://swr.now.sh/)
- [uuid](https://www.npmjs.com/package/uuid)
- [web-vitals](https://web.dev/vitals/
)
- [yup](https://www.npmjs.com/package/yup )

</br>

### Backend
- [axios](https://github.com/axios/axios)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [connect-history-api-fallback](https://www.npmjs.com/package/connect-history-api-fallback)
- [cors](https://www.npmjs.com/package/cors)
- [curl](https://www.npmjs.com/package/curl)
- [dotenv-safe](https://www.npmjs.com/package/dotenv-safe)
- [express](https://expressjs.com/)
- [mongoose](https://mongoosejs.com/)
- [morgan](https://www.npmjs.com/package/morgan)
- [ejs](https://www.npmjs.com/package/ejs)
- [helmet](https://www.npmjs.com/package/helmet)





## Development team:
- [Altansukh Tumenjargal](alttum@net.chalmers.se)
- [Maryo Idress Nano Nano](maryo@net.chalmers.se) 


## Credits 
We are satisfied with our learning and development efforts we
dedicated. We “Team 13” thank the lecturer, examiner, course responsible and our teaching assistant for the lectures, advices, supervision and for the learning opportunity. Thank you again. 

## License

MIT Â© Group-13 for DIT356
The source code for the site is licensed under the MIT license, which you can find in the MIT-LICENSE.txt file.
