# PC Parts List

This is a project built from using `express-generator` and is run purely on NodeJS and using the Pug (formally Jade) template engine.

This application allows users to share a PC build they already made or plan to make with other users.

> Supports Dark Mode & Limited Offline Mode (via cached pages)!

https://user-images.githubusercontent.com/83375816/181835204-cf845b43-0309-4af6-85c3-1e22700de36b.mp4

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

## Uploads

We utilized the `multer` package to handle image upload for Categories & Build Lists. We don't do this for Products due to the amount of products we can have (comparatively, we won't have much Categories and not as much Builds compared to products).

- We use the `fluent-ffmpeg` package to convert uploaded images to `.webp` for storage efficiency.

# Installation & Setup

## Environment Variables

We utilze 2 environment variables: `MONGO_URI` and `ADMIN_PASSWORD`.
| Variable Name | Value |
| ------------- | ----- |
| `MONGO_URI` | URI value to your MongoDB server. |
| `ADMIN_PASSWORD` | A password to access admin-related features in the app. |

## How To Run

Since the service worker file is already created, all you have to do (after creating a MongoDB database & setting the `.env` variables) is run `npm start` to run the app.
