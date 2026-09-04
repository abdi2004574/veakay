# Technical Requirements Document
## Veakay
## Version 1.0

## Project Overview

This platform enables travelers to raise funds for vacations and collaborate with travel agencies to plan their trips. Users can create campaigns, track donations, build itineraries, and share their experiences. Travel agencies can offer packages, manage requests, and receive payments while interacting directly with travelers.

#### Goals & Objectives:

- Enable travelers to fund and plan trips efficiently.
- Provide real-time collaboration between travelers and agencies.
- Ensure security, trust, and transparency in campaigns and payments.
- Promote community engagement and social interaction among travelers.
- Provide agencies with tools for marketing, analytics, and client management.

#### Target Platform

- **Mobile App User (iOS + Android)**
- **Travel Agencies / Agents (Mobile App iOS + Android)**
- **Admin panel (Web Panel)**

## Core Features

## User Interface

### Authentication Module

#### Sign Up

- User can sign up using:
- Email & Password
- Google
- Apple
- OTP verification via email
- After successful sign-up, the user must complete Traveler Profile Setup
- User must accept Terms & Conditions and Privacy Policy

#### User Profile Setup (At Sign-Up Time)

**Functional Requirements:**

- User creates traveler profile with:
  - Profile photo(s)
  - Travel preferences (destination types, travel style)
  - Previous trips Photos (optional)
- User can optionally connect:
  - Wallet/payment method (PayPal, Stripe, etc.) for receiving funds
- System assigns a default Traveler Status Badge
  - Initial badge: Dreamer
  - Other badges (Explorer, Jetsetter) are unlocked later based on milestones

**User Stories**

- As a traveler, I want to sign up using email or social login so I can quickly access the app.
- As a traveler, I want to create my profile during sign-up so others can see my travel interests.
- As a traveler, I want to connect my wallet at sign-up so I am ready to receive travel funds.
- As a traveler, I want to receive a status badge, so I feel motivated to complete my travel goals.

#### Login

**Functional Requirements**

- User can log in using:
  - Email & Password
  - Social login
- OTP-based login option
- Secure session handling
- Logout functionality

**User Stories**

- As a traveler, I want to log in easily so I can manage my travel campaigns.
- As a traveler, I want my session to be secure so my data is protected.

#### Forgot Password

**Functional Requirements**

- User can request a password reset via:
  - Email OTP or reset link
- OTP / link expires after a defined time
- User can set a new password securely

**User Stories**

- As a traveler, I want to reset my password if I forget it so I can access my account again.

#### Vacation Campaign Creation

**Functionality:**

- Create a travel fund (like GoFundMe).
- Add goal amount, destination, trip dates, and personal story.
- Upload images, itineraries, or agency quotes.
- Set privacy settings: public or invite-only.
- Real-time progress tracking bar for donations.
- "Gift Mode" to allow friends/family to contribute to special occasions.
- Edit or Delete

**User Stories:**

- As a traveler, I want to create a campaign so that my friends/family can fund my trip.
- As a traveler, I want to see a real-time progress bar so that I know how close I am to my goal.
- As a traveler, I want my gift donations to be automatically recorded so I don't have to track them manually.
- As a traveler, I want to see all my gift contributions, so I know which campaigns I supported.
- As a traveler, I want the fundraising progress to update automatically when I donate so I can see the impact in real-time

#### Itinerary Builder & Agency Collaboration

**Functionality:**

- Browse or request trip packages from agencies.
- Link the chosen package directly to the fundraiser.
- Real-time chat/video consultation with agencies.
- Auto-suggestions for affordable trips based on funding progress.

**User Stories:**

- As a traveler, I want to chat with an agent to personalize my trip.
- As a traveler, I want the app to suggest trips I can afford based on my current funds.

#### Agency Ratings & Reviews by Traveler

**Functionality**

- After a completed trip, the traveler can rate the agency (1–5 stars)
- Traveler can write a review/feedback for the agency
- Reviews are visible on the agency profile for other travelers
- Average rating calculated and displayed on agency profile
- Option to edit or delete review within 7 days

**User Stories**

- As a traveler, I want to rate the agency after my trip so that I can share my experience.
- As a traveler, I want to write a review for the agency so that others can make informed decisions.
- As a traveler, I want to see my past reviews so I can update or delete them if needed.
- As a traveler, I want my reviews to appear on the agency profile so that other users can trust the agency.

#### Social Feed & Community

**Functionality:**

- Travelers can create their own posts in the feed.
- Travelers can edit their own posts.
- Travelers can delete their own posts.
- Like, comment, and share campaigns.
- Feed displays campaigns, trip progress, and travel memories.
- Follow other travelers and join interest groups.
- "Journey Journal" to post trip blogs after completed trips.

**User Stories:**

- As a traveler, I want to see my friends' campaigns and travel updates.
- As a traveler, I want to post my completed trips as blogs.
- As a traveler, I want to create posts in the feed so I can share my trip updates and campaigns.
- As a traveler, I want to edit my posts so I can update information or correct mistakes.
- As a traveler, I want to delete my posts so I can remove content I no longer want visible.

#### Payment & Withdrawal

**Functionality:**

- Secure fund collection via Stripe, PayPal, or in-app wallet.
- Withdraw funds after campaign verification and goal completion.
- Track donations and see top contributors.

**User Stories:**

- As a traveler, I want to withdraw funds once I have reached my goal securely.
- As a traveler, I want to see who contributed the most to my trip.
- As a traveler, I want all my contributions and donations to be tracked automatically so I can view my full donation history.

#### Friends & Group Trips

**Functionality:**

- Add friends and view their campaigns.
- Create group travel funds (bachelor trips, family reunions).
- Shared chat and planning tools for groups.
- All contributions/donations from friends to the group fund are automatically recorded.
- Group members can manually enter their contributions / spend amounts.

**User Stories:**

- As a traveler, I want to contribute to my friends' campaigns.
- As a traveler, I want to plan trips with my friends in one campaign.
- As a traveler, I want all contributions from friends in a group fund to be automatically tracked so I don't have to manage them manually.
- As a traveler, I want the group fund progress to update based on manual inputs, so we know the total Spend from contributions.

#### Chat Module

**Functionality**

- **1:1 Chat with Friends:** Send text messages with sent/delivered/read status.
- Group Chat with Friends:
  - Create group chats for planning trips.
  - Add/remove members.
  - Share images, PDFs, and trip documents.
- **1:1 Chat with Agency:** Text-based consultation.
- **Audio & Video Calls with Agency:** Start or receive calls.
- **Document / Media Sharing:** Upload/download images, PDFs, DOCX, etc.

**User Stories**

- As a traveler, I want to chat 1:1 with my friends so we can plan trips together.
- As a traveler, I want to create group chats with friends for collaborative planning.
- As a traveler, I want to share documents and media in friend chats so that trip planning is easier.
- As a traveler, I want to chat 1:1 with an agency for consultation.
- As a traveler, I want audio and video calls with agencies for detailed consultation.
- As a traveler, I want to share documents and itineraries with agencies for trip planning.

#### Notifications

**Functionality:**

- Real-time updates for donations, shares, and agency responses.
- Milestones: 25%, 50%, 100% funded.
- Celebrate milestones with animations and shareable badges.

**User Stories:**

- As a traveler, I want to get notified when someone donates.
- As a traveler, I want milestone badges to celebrate achievements.
- As a traveler, I want notifications for new messages, calls, or shared files so I don't miss updates.
- As a traveler, I want notifications for Like Comment Share so I don't miss updates

#### Explore Section

**Functionality:**

- Discover trending destinations, popular campaigns, and agency offers.
- Filter by location, trip type, and funding progress.
- Geo-map for campaigns around the world.

**User Stories:**

- As a traveler, I want to explore trending trips near me.
- As a traveler, I want to filter campaigns by type of trip.

#### Security & Verification

**Functionality:**

- Identity verification for high-value withdrawals.
- Verified campaign badges to build donor trust.

**User Stories:**

- As a traveler, I want my identity verified so that donors trust my campaign.

#### My Profile

**Functionality**

- The user can view the My Profile screen
- Profile shows:
  - Profile photo
  - Full name
  - Travel preferences
  - Previous trips
  - Status badge (Dreamer / Explorer / Jetsetter)
  - Total campaigns created
  - Total trips completed
  - Edit Profile button available

**User Stories**

- As a user, I want to view my profile so I can see my travel details.
- As a user, I want my badge to be visible to show my progress.

**Edit Profile**

- User can edit:
  - Profile photo
  - Name
  - Bio
  - Travel preferences
  - Previous trips
  - Save changes button
  - Changes reflect immediately

**User Stories**

- As a user, I want to edit my profile so my information stays updated.

#### Settings

**Account Settings**

- Change password
- Logout
- Delete account (optional)

**Wallet & Payments**

- Connect/disconnect payment method
- View connected wallet

**Privacy Settings**

- Campaign visibility: Public / Invite-only

**Notification Settings**

- Donation alerts
- Campaign updates
- Agency messages

**User Stories**

- As a user, I want to manage my account and security.
- As a user, I want control over my privacy and notifications

## Travel Agency Interface

### Authentication Module

#### Sign Up

**Functional Requirements**

- Dedicated Agency Sign-Up
- Agency can sign up using:
  - Email & Password
- OTP verification via email
- After sign-up, the agency must complete Agency Registration & Verification
- Terms & Conditions acceptance is mandatory

#### Agency Registration & Verification

**Functional Requirements:**

- Agency must provide:
  - Agency name
  - Business contact details
  - Business address
- Upload documents:
  - Business licenses
  - Certifications
  - Legal documents
- The agency profile remains Pending Verification until approved by Admin
- After approval, the agency receives:
  - Verified Agency Badge
- System tracks:
  - Agency reputation score (based on ratings & successful trips)

**User Stories**

- As a travel agency, I want to register my business so I can offer travel packages.
- As an agency, I want to upload licenses so users trust my authenticity.
- As an agency, I want a verified badge so travelers feel confident booking with me.
- As an agency, I want my reputation score to improve based on successful trips.

#### Login

**Functional Requirements**

- Login using Email & Password
- OTP-based login option (optional)
- Secure session handling
- Logout functionality

**User Stories**

- As an agency, I want to log in so I can manage user requests and packages.

#### Forgot Password

**Functional Requirements**

- Password reset via email OTP or reset link
- Secure password update

**User Stories**

- As an agency, I want to reset my password if I forget it.

#### Dashboard & Analytics

**Functionality:**

- Central dashboard to manage campaigns, messages, and user interactions.
- Analytics: requested destinations, user demographics, popular packages, and funding trends.

**User Stories:**

- As an agency, I want insights into which trips are most funded.

#### Package & Itinerary Management

**Functionality:**

- Upload trip packages with prices, visuals, and itineraries.
- Tag packages by destination, season, or theme.
- Allow trip customization by users.
- Dynamic packages adjust pricing based on fundraising progress.

**User Stories:**

- As an agency, I want to create packages that users can customize.

#### Chat Module

**Functionality**

- **1:1 Chat with Travelers:** Respond to traveler queries in real-time.
- **Audio / Video Consultation:** Start or accept calls with travelers.
- **Document / Media Sharing:** Share itineraries, quotes, invoices, or promotional materials.

**User Stories**

- As an agency, I want to respond to traveler messages in real-time.
- As an agency, I want audio and video calls with travelers for consultation.
- As an agency, I want to share documents and media with travelers.

#### User Requests & Communication

**Functionality:**

- Receive requests directly from travelers.
- Chat to discuss trips, share quotes, and documents.
- Booking management and follow-up system.
- Smart reply templates for frequent inquiries.

**User Stories:**

- As an agency, I want to respond to user inquiries efficiently.

#### Payment & Commissions

**Functionality:**

- Receive payments for booked trips.
- Track pending invoices.
- App deducts the platform fee as commission.
- Optional subscription tiers (Basic, Premium, Featured) for more visibility.

**User Stories:**

- As an agency, I want to receive payments safely and track invoices.

#### Promotional & Marketing Tools

**Functionality:**

- Promote trips in the Explore feed.
- Sponsored placements and influencer collaborations.
- Top-Rated Agency leaderboard monthly feature.

**User Stories:**

- As an agency, I want to promote my top packages to increase bookings.

#### Reviews & Ratings

**Functionality:**

- Agencies receive post-trip ratings and reviews.
- Reputation system improves discoverability.

**User Stories:**

- As an agency, I want user ratings to build credibility.

#### Notifications

**Functionality:**

- Alerts for new messages, trip requests, and payments.
- Option to integrate with CRM tools for leads and campaign management.
- alerts for new traveler messages, calls, or shared files.

**User Stories:**

- As an agency, I want timely alerts for all traveler interactions.

#### Admin & Compliance Tools

**Functionality:**

- Manage staff users under the agency profile.
- Built-in compliance system to ensure trip authenticity and user safety.

**User Stories:**

- As an agency admin, I want to control staff access and maintain compliance.

#### My Profile

**Functionality**

- Agency can view My Profile
- Profile shows:
  - Agency name
  - Business description
  - Contact details
  - License & certification status
  - Verification badge (if approved)
  - Total trips completed
  - Edit Profile button available

**User Stories**

- As an agency, I want to view my profile to check business information.
- As an agency, I want my verification badge to be visible to build trust.

**Edit Profile**

- Agency can edit:
  - Logo
  - Business name
  - Description
  - Contact information
  - Upload/update licenses and certificates
  - Save changes button

**User Stories**

- As an agency, I want to update my business profile when needed.

#### Settings

**Account Settings**

- Change password
- Logout

**Business Settings**

- Update business documents

**Payment & Commission**

- View commission details
- View payment history

**Notification Settings**

- New user requests
- Messages
- Payment alerts

**User Stories**

- As an agency, I want to manage staff and business settings.
- As an agency, I want alerts for new requests and payments.

## Super Admin Interface

#### User & Agency Management

**Functionality:**

- View, approve, or reject Traveler & Agency registrations.
- Manage user accounts: deactivate/reactivate, edit profile info.
- Assign verified badges for high-trust users or agencies.
- Generate user/agency reports (total users, active campaigns, funding trends).

**User Stories:**

- As an admin, I want to approve or reject agency registrations to maintain platform trust.
- As an admin, I want to deactivate malicious user accounts to ensure platform safety.

#### Campaign & Trip Oversight

**Functionality:**

- View all active traveler campaigns.
- Approve or flag campaigns for fraud prevention.
- Monitor trip itineraries linked to campaigns.
- Track high-value transactions or suspicious activity.

**User Stories:**

- As an admin, I want to flag suspicious campaigns to protect donors.
- As an admin, I want to monitor campaign progress and payments.

#### Payment & Transaction Management

**Functionality:**

- View all payments and withdrawals.
- Monitor platform commissions and deduct fees from transactions.
- Refund management if a campaign is canceled or fraudulent.
- Generate financial reports: total funds raised, fees collected, withdrawal stats.

**User Stories:**

- As an admin, I want to generate monthly revenue reports for accounting.
- As an admin, I want to process refunds if a campaign is canceled.

#### Analytics & Insights

**Functionality:**

- Dashboard for platform-wide metrics: active users, campaigns, trips, and top destinations.
- Insights into user demographics, campaign success rates, and funding trends.
- Identify top-performing agencies and travelers.

**User Stories:**

- As an admin, I want to see the platform growth and campaign statistics.
- As an admin, I want to highlight top-performing agencies or travelers.

#### Content & Compliance Management

**Functionality:**

- Manage reported content: posts, blogs, photos, or campaign media.
- Ensure compliance with KYC, GDPR, and payment regulations.
- Manage platform-wide terms & conditions, privacy policies, and notifications.

**User Stories:**

- As an admin, I want to remove inappropriate content to maintain community standards.
- As an admin, I want to enforce compliance with safety and legal requirements.

#### Notifications & Alerts

**Functionality:**

- Receive system alerts for unusual activity (high-value withdrawals, flagged campaigns).
- Send notifications to users and agencies (policy updates, announcements).

**User Stories:**

- As an admin, I want to receive alerts for suspicious transactions.
- As an admin, I want to send system-wide notifications to users.

#### Security & Audit Logs

**Functionality:**

- Maintain audit logs for all admin actions: approvals, edits, and deletions.
- Two-factor authentication for admin login.
- Track changes to campaigns, user accounts, and payments.

**User Stories:**

- As an admin, I want to see who approved or deleted a campaign to maintain accountability.

#### My Profile

**Functionality**

- Admin can view
- Profile shows:
  - Admin name
  - Email
- Edit profile button available

**User Stories**

- As an admin, I want to view my profile and role details.

**Edit Profile**

- Admin can edit:
  - Name
  - Password
  - Save changes button

**User Stories**

- As an admin, I want to update my profile for security reasons.

#### Settings

**Account Settings**

- Change password
- Logout

**System Settings**

- Manage platform configurations

**Notification Settings**

- New user sign-ups
- New agency verification requests
- Reported issues

**User Stories**

- As an admin, I want control over system and security settings.
- As an admin, I want alerts for important platform activities.
