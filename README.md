# Smart Bookmark App

##  Overview
This is a full-stack **Smart Bookmark application** built using **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**. 

The app allows users to securely manage personal bookmarks with Google OAuth authentication and real-time synchronization across devices and tabs.

---

##  Features
- **Google OAuth Authentication:** Secure login without the need for email/password.
- **Private Bookmarks:** Database-level security ensures users only see their own data.
- **Full CRUD Support:** - Add bookmarks (Title + URL)
  - Edit existing bookmarks
  - Delete bookmarks with **Optimistic UI** for instant feedback.
- **Real-time Synchronization:** Updates reflect across multiple tabs instantly without refreshing.
- **Fully Deployed:** Optimized for and hosted on **Vercel**.

---

##  Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Backend/Database** | Supabase (PostgreSQL) |
| **Authentication** | Google OAuth via Supabase Auth |
| **Security** | Row Level Security (RLS) |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

##  Database Security
Row Level Security (RLS) is strictly enabled on the `bookmarks` table. Policies enforce the following rules:

* **SELECT:** Users can only view their own bookmarks.
* **INSERT:** Users can only add bookmarks where `user_id == auth.uid()`.
* **UPDATE/DELETE:** Users can only modify or remove their own records.

> This ensures true database-level isolation and prevents unauthorized data access.

---

##  Realtime Implementation
Supabase Realtime is implemented to keep the UI in sync.

```javascript
const channel = supabase
  .channel("bookmarks-changes")
  .on(
    "postgres_changes", 
    { event: "*", schema: "public", table: "bookmarks" }, 
    (payload) => 
  )
  .subscribe();
```
---

## AI Tools Used

During development, AI tools were leveraged for architecture planning, debugging OAuth integrations, and RLS configuration.

* ChatGPT (GPT-5)
* Claude Code

---

## Challenges Faced

1. Google OAuth Redirect Issues
Problem: Encountered redirect_uri_mismatch and provider-not-enabled errors.

Solution: Correctly configured the Supabase callback URL and added the exact redirect URI in the Google Cloud Console.

3. Supabase RLS Blocking Queries
Problem: Initial SELECT and INSERT operations failed after enabling RLS.

Solution: Created granular policies using auth.uid() = user_id and clarified the distinction between USING and WITH CHECK clauses.

3. Realtime Subscription Cleanup
Problem: Potential for memory leaks or duplicate listeners.

Solution: Implemented proper useEffect cleanup patterns to unsubscribe from channels on component unmount.

---

## Deployment

GitHub: Public repository for version control.

Vercel: Automated CI/CD deployment.
