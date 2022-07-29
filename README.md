# PC Parts List

This is a project built from using `express-generator` and is run purely on NodeJS and using the Pug (formally Jade) template engine.

This application allows users to share a PC build they already made or plan to make with other users.

> Supports Dark Mode & Limited Offline Mode (via cached pages)!

**Live Demo Site:** https://cyanchill-pc-parts-list.herokuapp.com/

## Permissions

**Normal Users** should be able to:

- Create Builds
- Update/Delete Builds they know the password to
- Add Manufacturers
- Add Products

**Admin Users** should be able to (on top of normal users permissions):

- Update/Delete Builds with an admin password
- Add/Update/Delete Categories
- Delete Manufacturers
- Update/Delete Products

## .env File

We utilze 2 environment variables: `MONGO_URI` and `ADMIN_PASSWORD`.

## Uploads

We utilized the `multer` package to handle image upload for Categories & Build Lists. We don't do this for Products due to the amount of products we can have (comparatively, we won't have much Categories and not as much Builds compared to products).

- We use the `fluent-ffmpeg` package to convert uploaded images to `.webp` for storage efficiency.

# How To Run

Since the service worker file is already created, all you have to do (after creating a MongoDB database & setting the `.env` variables) is run `npm start` to run the app.
