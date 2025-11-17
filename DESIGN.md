### Overview ###
This is an album review application that allows users to browse albums from various artists and leave their own rating and comment on albums they've listened to. 
Reviewed albums get added to the User's album collection.

### Functionality ###
- User authentication and registration with role-based access
- Browse albums and artists
- Create personal album reviews with ratings and comments
- Users view and manage their own album collection
- Admin functionality for managing artists and albums
- Session-based authentication with secure password hashing
- RESTful API endpoints for all CRUD operations

### Models ###

## User Model
- User fields - name, email, password, role (user/admin)
- User role has basic authentication
- Admin role includes admin functionality
- Passwords use bcrypt password hashing

## Artist Model
- Artist fields - name, releases, bio
- Album schema is embedded within the releases array
- Each album contains title, genres, year
- Only admin can modify artists and albums

## Review Model
- Review fields - rating, comment, userId
- Rating is between 0-10
- Comments are optional
- User can only have one review per album
- User can only modify their own 
- Reviews are added to the user's collection

### Database Relationships ###

![Database ERD](image.png)

## Artist to Album Relationship  
- 1:M - One Artist can have multiple Albums. Albums can only belong to one Artist
- The Album schema is embedded within the Artist's releases array
- Albums cannot exist without an Artist

## Album to Review Relationship
- 1:M - One Album can have multiple reviews. Reviews can only belong to one Album
- Each Review contains an albumId field that references the Album's ObjectId

## User to Review Relationship
- 1:M - One User can have multiple Reviews. Reviews can only belong to one User.
- Each Review contains a userId field that references the User's ObjectId
- Reviews cannot exist without a User

### Controllers / API Endpoints ###

## Authentication Routes (/auth)
- POST /register - Creates a new user
- POST /login - Starts the user's session
- POST /logout - Ends the user's session
- GET /me - Get current user info

## Album Routes (/albums)
- GET / - Get all albums from all artists (no auth)
- GET /:id - Get specific album details (no auth)
- PUT /:id - Update album (admin only)
- DELETE /:id - Delete album (admin only)

## Artist Routes (/artists)
- GET / - Get all artists (no auth)
- GET /:id - Get specific artist details (no auth)
- POST / - Create new artist (admin only)
- PUT /:id - Update artist (admin only)
- DELETE /:id - Delete artist (admin only)

## Review Routes (/reviews)
- GET / - Get all of the user's reviews (auth only)
- GET /:id - Get specific review details (auth only)
- POST / - Add album to collection with review (auth only)
- PUT /:id - Update review (auth only)
- DELETE /:id - Delete review (auth only)

### Authentication & Authorization ###

## Authentication
- Express-session with MongoDB store
- Secure session cookies
- Password hashing with bcrypt
- Role-based middleware (requireAuth, requireAdmin)

## Authorization
- Public users: View albums and artists
- Authenticated Users: Manage personal reviews/collection
- Admins: Full CRUD on artists and albums
- Users can only access their own reviews

### Testing ###

## Integration Testing
- Api endpoints tested automatically using Jest
- API endpoints tested manually using Insomnia
- Database operations tested using MongoDB Compass
- Verifying authentication
- Schema validation
- CRUD validation
- Error handling validation

## Unit Testing
- Models testing using Jest
- Schema field validation (missing fields, valid fields)
- User role validation
- Password hashing and verification methods
- ObjectId reference validation