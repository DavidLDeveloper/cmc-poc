# CMC - POC - WORK IN PROGRESS

Proof of concept project for **Content-Model-Controller** architecture. Made to bridge the gap between a static site generator with Nginx or Apache and a full stack framework delivering content from CMS. The idea being that many of these sites are +90% static content most efficiently served by a dedicated static page server, e.g. Nginx or Apache, but users often want easy updating of edited pages without deployments.

## Architecture

### Content

Static HTML in dev served by express.js, in prod served by Nginx or Apache or similar static server that reverse proxies to express server for dynamic content, business logic, and content editing.

### Model

Stores unrendered content in Markdown or other plain text templating language.
Also stores, in same or another DB, business data like auth, leads, emails,etc.

### Controller

Contains rest routes accessed through reverse proxy for:

- Page publishing.
- Content editing.
- Dynamic content.
- Business logic.
- Other backend tasks.

## Design Principles

1. Content should be stored in easily human readable, portable, and migratable plain text, like markdown or templating languages.

2. Where possible, code should be written with modularitly and swappability in mind. For example, calls to model should be made through helpers so if model is replaced only the helpers need updating. Or, if controller switches from express to hapi only server.mjs and controllers whould need refactoring not model or components.

## Installation

## Usage

## References
