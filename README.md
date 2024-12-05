# Daily Diet API

This is a backend API built with Node.js and TypeScript, designed to help users manage their meals and track dietary habits effectively. The API provides endpoints for user authentication, meal management, and dietary statistics.

## Application Rules

- [x] **User Management**
  - [x] It must be possible to create a user.
  - [x] It must be possible to identify the user across requests.

- [x] **Meal Management**
  - [x] It must be possible to register a meal with the following information:
    - [x] Name
    - [x] Description
    - [x] Date and Time
    - [x] Whether it is within the diet or not.
  - [x] Meals must be linked to a user.
  - [x] It must be possible to edit a meal, allowing all data to be updated.
  - [x] It must be possible to delete a meal.
  - [x] It must be possible to list all meals for a user.
  - [x] It must be possible to view a single meal.

- [x] **User Metrics**
  - [x] It must be possible to retrieve user metrics, including:
    - [x] Total number of meals registered.
    - [x] Total number of meals within the diet.
    - [x] Total number of meals outside the diet.
    - [x] Best streak of meals within the diet.

- [x] **User Access Control**
  - [x] Users must only be able to view, edit, and delete meals they have created.

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=sqlite,postgres,ts,nodejs,vitest,pnpm)](https://skillicons.dev)

## Prerequisites

- pnpm
- node 20+

## Getting Started

1. Clone the repository
```
git clone <repository-url>
cd <repository-folder>
```

2. Install dependencies
```
pnpm i
```

3. Configure Environment Variables
    - Locate the .env.example and .env.test.example files in the root directory.
    - Copy them to create the necessary environment configuration files:
```
cp .env.example .env
cp .env.test.example .env.test
```

4. Open the newly created .env and .env.test files and update the values according to your setup. These files contain the environment-specific configurations required for the application.

5. Run Database Migrations
```
pnpm knex -- migrate:latest 
```

6. Start the API Server
```
pnpm dev
```