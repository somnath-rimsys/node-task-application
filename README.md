# nodejs-task-application
Node js and express application for creating endpoints.

### Project setup
- After cloning the repository need to run `npm install`
- Next create two files, `.env` and `.test.env` file inside the project root and add the below key and value
```
  MONGODB_URL=
  SENDGRID_EMAIL_API_KEY=
  JWT_SECRET=
```

> Note: You need to login to [Sendgrid-Email](https://sendgrid.com) to get your own api key and set the value for SENDGRID_EMAIL_API_KEY

### Features
1. Authentication
2. Password hashing
3. File uploading
4. Email Sending

### Endpoints
Users end points

| Method | Endpoint | Body | Param | Header |
| - | - | - | - | - |
| POST | /user/create | {<div style="margin-left: 16px">name(String),<br> email(String),<br> password(String), <br>age(Number)(optional) </div>} | none | none |
| POST | /user/login | {<div style="margin-left: 16px">email (String),<br>password (String)</div>} | none | none |
| POST | /user/logout | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| POST | /user/logoutAll | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| GET | /user/all | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| GET | /user/profile | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| PATCH | /user/update | {<div style="margin-left: 16px">name(String), email(String), password(String), age(Number)</div>} | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| DELETE | /user/delete | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| POST | /user/profile/avatar | avatar(file) | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| DELETE | /user/profile/avatar | none | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| GET | /user/profile/avatar | none | id | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |

Task end points

| Method | Endpoint | Body | Param | Header |
| - | - | - | - | - |
| POST | /task/create | {<div style="margin-left: 16px">description(String), completed(Boolean)(optional)</div>} | none | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| GET | /task/all | none | completetd(Boolean)<br>limit=(Number)&skip=(Number)<br>sortBy=(Query string) | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| GET | /task/:id | none | id | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| PATCH | /task/:id | {<div style="margin-left: 16px">description(String), completed(Boolean)(optional)</div>} | id | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |
| DELETE | /task/:id | none | id | {<div style="margin-left: 16px">"Authorization" : "Bearer jwt-token"</div>} |

### Dependencies
-  [Bcrypt](https://www.npmjs.com/package/bcryptjs) - For password hashing
-  [Chalk](https://www.npmjs.com/package/chalk) - For styling the console message
-  [Express](https://expressjs.com) - For creating server
-  [Env-Cmd](https://www.npmjs.com/package/env-cmd) - For accessing environment variables
-  [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - For creating jwt auth token
-  [JestJs](https://jestjs.io/docs/getting-started) - For testing
-  [Mongoose](https://mongoosejs.com) - For mongodb validation, casting and business logic
-  [Multer](https://www.npmjs.com/package/multer) - For file uploading
-  [Sharp](https://www.npmjs.com/package/sharp) - For converting and resizing the uploaded image file
-  [Sendgrid-Email](https://sendgrid.com) - For sending email in nodejs
-  [Supertest](https://www.npmjs.com/package/supertest) - For testing
-  [Validator](https://www.npmjs.com/package/validator) - For validating email

---
##### _Document prepared by: Somnath Sardar_