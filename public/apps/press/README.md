# Riverside Books — Marketing Content Generator

A staff-facing web app for creating, previewing, and scheduling social media content for Riverside Books.

The app connects to the shared Riverside Books Supabase catalog so staff can browse books and events, generate platform-specific social content, preview posts, and manage upcoming and published post history.

## Product Suite

This repository is **Product D** in the Riverside Books product suite. The products share a common Supabase backend and catalog.

| Product                         | Repository                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Readers app                     | [erickmarcatoma/riverside-readers-app](https://github.com/erickmarcatoma/riverside-readers-app)       |
| Customer chatbot                | [IshmamHaque1112/riverside-books-chatbot](https://github.com/IshmamHaque1112/riverside-books-chatbot) |
| Inventory app                   | [mosiahjames-ui/riverside-inventory-app](https://github.com/mosiahjames-ui/riverside-inventory-app)   |
| **Marketing content generator** | **[maramzv/riverside-social-app](https://github.com/maramzv/riverside-social-app)**                   |

## Features

* Browse and search the shared books and events catalog
* View live catalog counts
* Select a social platform:

  * Instagram
  * TikTok
  * X
  * Facebook
  * Pinterest
* Select an asset type and writing tone
* Generate platform-ready captions and hashtags
* Preview content using platform-inspired layouts
* Upload media or use included demo assets
* Create posts for immediate publication or future scheduling
* View post history in:

  * List view
  * Calendar view
* Separate **Upcoming** and **Published** posts
* Share catalog data with the other Riverside Books products through Supabase

## Tech Stack

* Vanilla HTML
* CSS
* JavaScript using ES modules
* No frontend framework
* No build step
* PostgreSQL through the shared Supabase project

## Getting Started

## Configuration

The application uses the shared Riverside Books Supabase project.


### Database Setup

The `supabase/` directory contains the project's database configuration, migrations, and policies.

Before running the application against a new Supabase project, make sure the required migrations and RLS policies have been applied.

The application expects the shared catalog and social-post data model used by the Riverside Books product suite.

## Shared Catalog

The marketing app reads from the same catalog used by the other Riverside Books products.

This allows staff to create social content directly from existing:

* Books
* Events
* Catalog metadata

Changes to shared catalog data may therefore be visible across multiple products.


## Project Structure

```text
.
├── index.html                 # Application shell and markup
├── app.js                     # Application logic and Supabase interactions
├── style.css                  # Application styling
├── config.js                  # Supabase client configuration
├── assets/                    # Static assets and demo media
├── supabase/                  # Supabase configuration, migrations, and policies
└── 9-csv-supabase-upload/     # CSV seed data and upload utility
```

## Social Content Workflow

The typical staff workflow is:

1. Browse the shared catalog.
2. Select a book or event.
3. Choose a social platform.
4. Choose an asset type and tone.
5. Generate a caption and hashtags.
6. Review the platform-style preview.
7. Upload media or select a demo asset.
8. Publish immediately or schedule the post.
9. Track the post from the Upcoming or Published history views.

## Scheduling and Publishing

The app supports creating posts with immediate or future publication states.

The post history tracks the status of content so staff can see what is upcoming and what has already been published.

If direct publishing integrations with Instagram, TikTok, X, Facebook, or Pinterest are not configured, the application should be treated as a content-management and scheduling interface rather than a replacement for those platforms' publishing systems.


## Development Status

**Actively in development.**

The application is currently focused on the staff-facing content creation, preview, scheduling, and post-history workflow.

Features and database schemas may change as the Riverside Books product suite evolves.

When making changes, keep the shared Supabase schema and the other Riverside Books applications in mind to avoid breaking cross-product catalog functionality.

## Related Projects

* [Riverside Readers App](https://github.com/erickmarcatoma/riverside-readers-app)
* [Riverside Books Chatbot](https://github.com/IshmamHaque1112/riverside-books-chatbot)
* [Riverside Inventory App](https://github.com/mosiahjames-ui/riverside-inventory-app)
* **[Riverside Social App](https://github.com/maramzv/riverside-social-app)**

## License

Add the project's license information here if/when a license is selected.
