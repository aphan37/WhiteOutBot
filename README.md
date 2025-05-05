Whiteout Survival Web Companion

# Overview
The Whiteout Survival Web Companion transforms the existing open-source Discord bot (https://github.com/Reloisback/Whiteout-Survival-Discord-Bot) into a cloud-native, interactive web application. This platform enables players to manage alliances, redeem gift codes, detect in-game events, and execute administrative scripts directly from a browser. The project adheres to a zero-dollar budget, utilizing free-tier and open-source tools, and prioritizes a simple, mobile-friendly user experience.

1.1 Objectives

Web-Based Interface: Provide a browser-based UI for all existing Discord bot features.
Event Auto-Detection: Automatically retrieve and display in-game events after user authentication via character ID.
Script Execution: Enable users to trigger bot scripts (e.g., gift code redemption, alliance syncing) with real-time feedback.
Scalability and Security: Use Kubernetes, Docker, and Cloudflare for robust deployment and protection.
Cost Efficiency: Leverage free-tier services and open-source technologies exclusively.
User Experience: Deliver a clean, intuitive, and mobile-first interface inspired by modern developer dashboards.

1.2 Scope

Reuse and extend logic from the existing Python-based Discord bot, porting it to Go for the backend.
Support core features: user login, event detection, script execution, gift code management, and admin tools.
Deploy on free-tier infrastructure with high availability and minimal latency.
Exclude paid services, proprietary tools, or features requiring external subscriptions (e.g., premium APIs).

2. Technology Stack
The technology stack is selected for performance, scalability, and compatibility with free-tier services, aligning with the open-source ethos of the original bot.
2.1 Frontend

Next.js (v14): React-based framework with TypeScript for server-side rendering (SSR), static site generation (SSG), and API routes.
Vue.js (v3): Used for interactive components within Next.js pages, leveraging its lightweight and modular nature.
Tailwind CSS: Utility-first CSS framework for rapid, responsive, and customizable styling.
Vitest: Unit testing framework for Vue.js components, integrated with Next.js testing setup.
Cypress: End-to-end testing for frontend workflows.

2.2 Backend

Go (v1.23): High-performance language for building RESTful APIs, handling concurrency with goroutines, and integrating with PostgreSQL.
Gin: Lightweight Go web framework for routing and middleware.
GORM: ORM for PostgreSQL, simplifying database interactions and migrations.
Go-Testify: Testing framework for unit and integration tests.

2.3 Database

PostgreSQL (v16): Open-source relational database for storing user, alliance, event, and gift code data.
pgx: Native Go driver for PostgreSQL, optimized for performance.
Flyway: Database migration tool for version-controlled schema changes.

2.4 Infrastructure

Docker (v27): Containerization for frontend, backend, and database services.
Kubernetes (v1.31): Orchestration for managing containers, deployed on a free-tier cluster (e.g., Minikube for local testing or Oracle Cloud Free Tier).
Cloudflare: Free-tier services for DNS management, HTTPS, DDoS protection, and CDN.
GitHub Actions: CI/CD pipeline for automated testing, building, and deployment.

2.5 Development Tools

GitHub: Source control and collaboration, hosting the repository as a fork of https://github.com/Reloisback/Whiteout-Survival-Discord-Bot.
VS Code: IDE with Go, TypeScript, and Docker extensions.
Postman: API testing for backend endpoints.
Prometheus and Grafana: Monitoring for Kubernetes cluster performance (optional, if free-tier limits allow).

3. Architecture
The architecture is modular, microservices-based, and optimized for free-tier deployment. It reuses the Discord bot’s logic (e.g., event polling, gift code redemption) while introducing a web-friendly structure.
3.1 System Diagram
[User Browser]
    |
    v
[Cloudflare] --> DNS, HTTPS, DDoS Protection, CDN
    |
    v
[Kubernetes Cluster]
    |
    |--> [Ingress Controller (NGINX)]
    |        |
    |        |--> [Frontend Pod: Next.js + Vue.js]
    |        |       - SSR Pages
    |        |       - Vue Components
    |        |       - API Calls to Backend
    |        |
    |        |--> [Backend Pod: Go + Gin]
    |                - REST API (/login, /events, /scripts, /gift-codes)
    |                - Game API Integration
    |                - Script Execution
    |                - PostgreSQL Client
    |
    |--> [Database Pod: PostgreSQL]
             - Users, Alliances, Events, Gift Codes
             - Schema Migrations (Flyway)

3.2 Frontend Architecture

Next.js Pages:
/login: SSR page for character ID input and validation.
/dashboard: Protected route displaying alliance data, events, and script controls.
/gift-codes: Interface for managing gift codes.
/admin: Admin-only route for alliance management and event reminders.


Vue.js Components:
LoginForm.vue: Form for character ID input with validation feedback.
Dashboard.vue: Grid layout for alliance data, event cards, and script triggers.
GiftCodeTable.vue: Table for adding, redeeming, and viewing gift codes.
AdminTools.vue: Tools for alliance CRUD operations and member imports.


State Management: Vuex for managing frontend state (e.g., user session, event data).
Responsive Design: Tailwind CSS with mobile-first breakpoints, supporting dark mode via prefers-color-scheme.

3.3 Backend Architecture

REST API Endpoints (served by Gin):
POST /api/login: Authenticates character ID via game API, returns JWT token.
GET /api/events: Retrieves current and historical events for the authenticated user.
POST /api/scripts: Executes a script (e.g., redeem code, sync alliance) and returns results.
GET /api/gift-codes: Lists gift codes with status (redeemed, unredeemed, expired).
POST /api/gift-codes: Adds a new gift code.
DELETE /api/gift-codes/:id: Removes a gift code.
GET /api/admin/alliances: Lists alliances (admin-only).
POST /api/admin/alliances: Creates or updates an alliance.


Script Execution:
Scripts are ported from the Discord bot’s Python code to Go, preserving logic for:
Gift code redemption (pattern matching and API calls).
Alliance member syncing (polling game API for member lists).
Event detection (e.g., fishing, bear hunt).


Scripts run in isolated goroutines with timeout controls (e.g., 30 seconds).
Results are logged to PostgreSQL and streamed to the frontend via Server-Sent Events (SSE).


Game API Integration:
Polls the Whiteout Survival game API (assumed RESTful, based on bot’s functionality) for events and alliance data.
Uses rate-limiting (e.g., 1 request/second) to avoid API bans.
Caches responses in PostgreSQL to reduce API calls.


Authentication:
JWT tokens issued upon login, stored in browser cookies (HttpOnly, Secure).
Tokens validated via middleware for protected endpoints.



3.4 Database Schema
PostgreSQL tables are designed for efficiency and scalability, with indexes for frequent queries.
-- Users: Stores user authentication and admin status
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    character_id VARCHAR(50) UNIQUE NOT NULL,
    login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    admin_level INT DEFAULT 0, -- 0: regular, 1: admin
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_character_id ON users(character_id);

-- Alliances: Stores alliance metadata
CREATE TABLE alliances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    last_checked TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_alliances_name ON alliances(name);

-- Events: Stores in-game events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., fishing, bear_hunt
    character_id INT REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_character_id ON events(character_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);

-- Gift Codes: Stores gift code data
CREATE TABLE gift_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL, -- unredeemed, redeemed, expired
    expiry TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_gift_codes_code ON gift_codes(code);
CREATE INDEX idx_gift_codes_user_id ON gift_codes(user_id);


Migrations: Managed by Flyway, with scripts stored in /db/migrations (e.g., V1__initial_schema.sql).
Constraints: Foreign keys ensure referential integrity; unique constraints prevent duplicates.

3.5 Infrastructure

Docker:
Dockerfile for frontend: Builds Next.js app with Node.js 20, serves via next start.
Dockerfile for backend: Builds Go binary with multi-stage build, runs via gin.
Dockerfile for PostgreSQL: Uses official postgres:16 image with custom initialization scripts.


Kubernetes:
Pods: Separate pods for frontend, backend, and PostgreSQL.
Services: ClusterIP for internal communication, LoadBalancer for public access.
Ingress: NGINX Ingress Controller routes traffic based on domain paths.
ConfigMaps: Store environment variables (e.g., database URL, API keys).
PersistentVolumeClaim: For PostgreSQL data persistence.


Cloudflare:
Free-tier DNS for custom domain (e.g., whiteout-survival-web.example.com).
HTTPS via automatic SSL certificates.
DDoS protection and WAF rules for security.
CDN for caching static assets (e.g., Next.js build output).



4. Core Features
4.1 Login

Functionality:
Users enter a character ID on /login.
Frontend sends POST /api/login with { character_id }.
Backend validates ID via game API (assumed endpoint: GET /api/validate-character/{id}).
On success, issues JWT token and redirects to /dashboard.


Error Handling:
Invalid ID: Returns 400 with { "error": "Invalid character ID" }.
API failure: Returns 503 with retry-after header.


Security:
Rate-limit login attempts (e.g., 5/minute per IP).
Sanitize input to prevent injection attacks.



4.2 Event Detection

Functionality:
Post-login, backend polls game API (assumed: GET /api/events/{character_id}) every 5 minutes.
Identifies events (e.g., fishing, bear hunt) using pattern matching (ported from bot’s Python regex).
Stores events in events table with type and timestamp.
Frontend displays events as cards on /dashboard, with filters for type and date.


Script Logic (from bot):
Regex pattern: r"Event: (\w+) started at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})".
Maps event names to types (e.g., fishing_event -> fishing).


Performance:
Cache API responses for 5 minutes to reduce load.
Use PostgreSQL indexes for fast event retrieval.



4.3 Script Actions

Functionality:
Users trigger scripts via POST /api/scripts with { script_name, params }.
Supported scripts (ported from bot):
redeem_gift_code: Redeems a code via game API (POST /api/redeem).
sync_alliance_members: Fetches member list (GET /api/alliance/{id}/members) and updates alliances.
fetch_alliance_data: Retrieves alliance stats (GET /api/alliance/{id}).


Scripts run in goroutines with 30-second timeout.
Results streamed to frontend via SSE (/api/scripts/stream).


Error Handling:
Invalid script: Returns 400 with { "error": "Unknown script" }.
Timeout: Returns 504 with { "error": "Script timed out" }.


Security:
Restrict scripts to authenticated users.
Validate parameters to prevent command injection.



4.4 Gift Code Center

Functionality:
Users view codes on /gift-codes, with columns: Code, Status, Expiry, Actions.
POST /api/gift-codes: Adds a new code, validated for format (e.g., r"[A-Z0-9]{8}").
POST /api/scripts with redeem_gift_code: Redeems a code for the user.
Backend auto-expires codes after expiry date (cron job via Kubernetes).


Script Logic (from bot):
Pattern matching for codes in Discord messages (e.g., r"Code: ([A-Z0-9]{8})").
API call to redeem: POST /api/redeem with { code, character_id }.


Database:
Tracks code status per user in gift_codes table.
Indexes on code and user_id for fast queries.



4.5 Admin Dashboard

Functionality:
Accessible at /admin for users with admin_level > 0.
Features:
Alliance CRUD: Create, update, delete via POST /api/admin/alliances.
Member import/export: Upload CSV or fetch via sync_alliance_members.
Event reminders: Set cron jobs for event notifications (stored in events).


Scripts:
create_alliance: Calls game API to register alliance.
transfer_alliance: Updates created_by in alliances.




Security:
Admin-only endpoints protected by JWT middleware.
Audit logs for admin actions stored in events (type: admin_action).



5. User Interface and User Experience
5.1 Design Principles

Minimalism: Inspired by Vercel and Stripe dashboards, with clean typography and ample whitespace.
Accessibility: WCAG 2.1 compliance (e.g., ARIA labels, keyboard navigation).
Responsiveness: Mobile-first design with Tailwind breakpoints (sm, md, lg).
Feedback: Real-time notifications for script execution and errors using Vue.js toasts.

5.2 UI Components

Login Page:
Single input field for character ID.
Button with loading state during validation.
Error messages below input.


Dashboard:
Grid layout: Alliance stats (top), events (middle), script triggers (bottom).
Event cards with type, timestamp, and details.
Script buttons with dropdowns for parameters.


Gift Code Center:
Data table with sortable columns.
Modal for adding new codes.
Redeem button with confirmation dialog.


Admin Dashboard:
Tabbed interface: Alliances, Members, Reminders.
Forms for alliance creation and member imports.
Export button for CSV downloads.



5.3 Dark Mode

Enabled via prefers-color-scheme or manual toggle.
Uses Tailwind’s dark: prefix for styling (e.g., dark:bg-gray-800).

6. Testing Strategy
6.1 Unit Tests

Backend:
Test API endpoints with Go-Testify (e.g., TestLoginHandler).
Mock game API responses using httptest.
Validate database queries with pgx mocks.


Frontend:
Test Vue.js components with Vitest (e.g., LoginForm.spec.ts).
Mock API calls with MSW (Mock Service Worker).



6.2 Integration Tests

Test full workflows (e.g., login -> event detection -> script execution).
Use Docker Compose to spin up PostgreSQL and backend services.

6.3 End-to-End Tests

Use Cypress to simulate user interactions:
Login with valid/invalid character ID.
Redeem gift code and verify database update.
Execute admin script and check logs.


Run tests in CI/CD pipeline via GitHub Actions.

6.4 Performance Tests

Benchmark backend API with wrk (e.g., 100 concurrent users for /api/events).
Optimize database queries with EXPLAIN ANALYZE.
Ensure frontend bundle size < 500 KB (Next.js budget).

7. Deployment Plan
7.1 Local Development

Setup:
Clone repository: git clone https://github.com/<your-username>/Whiteout-Survival-Web-Companion.
Install dependencies: npm install (frontend), go mod tidy (backend).
Run PostgreSQL: docker run -p 5432:5432 postgres:16.
Apply migrations: flyway migrate.


Run:
Backend: go run cmd/api/main.go.
Frontend: npm run dev.
Access: http://localhost:3000.



7.2 CI/CD

GitHub Actions:
Lint and test on push (npm run lint, go test ./...).
Build Docker images on PR merge.
Deploy to Kubernetes cluster on tagged releases.


Workflow:name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      - run: go test ./...
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t whiteout-web .
      - run: docker push whiteout-web



7.3 Production Deployment

Cluster:
Use Oracle Cloud Free Tier (2 ARM instances) or Minikube for local testing.
Deploy Kubernetes manifests: kubectl apply -f k8s/.


Database:
Host PostgreSQL on free-tier provider (e.g., Neon.tech) or local cluster.
Initialize with sample data: psql < db/seed.sql.


Cloudflare:
Configure DNS to point to Kubernetes LoadBalancer IP.
Enable HTTPS and WAF rules.


Monitoring:
Use Cloudflare analytics for traffic.
Optional: Deploy Prometheus/Grafana if free-tier allows.



8. Future Features

Real-Time Syncing: Implement WebSocket for live event updates (e.g., using gorilla/websocket).
Discord Login: Integrate OAuth2 for Discord authentication, reusing bot’s Discord logic.
Leaderboards: Visualize alliance rankings using Chart.js.
AI Assistant: Add a chatbot for in-game tips, leveraging open-source LLMs (e.g., Hugging Face models).
Multi-Language Support: Use i18next for internationalization (English, Spanish, etc.).

9. Success Metrics

Adoption: 100 active users within 3 months of launch.
Performance: API response time < 200ms for 95% of requests.
Reliability: 99.9% uptime, measured via Cloudflare analytics.
User Satisfaction: 80% positive feedback on Discord server (https://discord.com/invite/h8w6N6my4a).
Cost: Maintain $0 operational cost, verified by free-tier usage reports.

10. Risks and Mitigation

Game API Changes:
Risk: Undocumented API changes break event detection or script execution.
Mitigation: Monitor API responses, maintain fallback logic, and engage community for updates.


Free-Tier Limits:
Risk: Exceeding free-tier quotas (e.g., Oracle Cloud CPU, Neon.tech DB size).
Mitigation: Optimize resource usage (e.g., lightweight containers, query caching).


Security:
Risk: DDoS attacks or SQL injection.
Mitigation: Use Cloudflare WAF, sanitize inputs, and implement rate-limiting.


User Adoption:
Risk: Low adoption due to complex setup or UI.
Mitigation: Provide video tutorials (as done for bot) and simplify onboarding.



11. References

GitHub Repository: https://github.com/Reloisback/Whiteout-Survival-Discord-Bot
Discord Community: https://discord.com/invite/h8w6N6my4a
Free-Tier Services: https://github.com/ripienaar/free-for-dev[](https://github.com/ripienaar/free-for-dev/blob/master/README.md?plain=1)
Whiteout Survival Community: https://www.reddit.com/r/whiteoutsurvival/[](https://www.reddit.com/r/whiteoutsurvival/comments/1i16aa1/whiteout_survival_discord_bot_v4_released/)
